package com.shopsphere.gateway.filter;

import com.shopsphere.common.enums.Role;
import com.shopsphere.common.security.JwtUtils;
import com.shopsphere.common.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtils jwtUtils;

    private static final List<String> PUBLIC_PATH_PREFIXES = List.of(
            "/api/v1/auth",
            "/actuator",
            "/fallback"
    );

    public AuthenticationFilter(@Value("${jwt.secret:ShopSphereSuperSecretKeyForJwtAuthenticationMustBeAtLeast256BitsLong!}") String jwtSecret) {
        this.jwtUtils = new JwtUtils(jwtSecret);
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // Correlation ID
        String correlationId = request.getHeaders().getFirst("X-Correlation-Id");
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }

        ServerHttpRequest.Builder requestBuilder = request.mutate()
                .header("X-Correlation-Id", correlationId);

        // Check if path is unconditionally public
        boolean isPublicPath = PUBLIC_PATH_PREFIXES.stream().anyMatch(path::startsWith);

        // Check if path is public GET endpoint (e.g. products, categories, search, reviews, active coupons)
        boolean isPublicGet = method == HttpMethod.GET && (
                path.startsWith("/api/v1/products") ||
                path.startsWith("/api/v1/categories") ||
                path.startsWith("/api/v1/brands") ||
                path.startsWith("/api/v1/search") ||
                path.startsWith("/api/v1/reviews") ||
                path.startsWith("/api/v1/coupons/active") ||
                path.startsWith("/api/v1/shipping/track")
        );

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtils.validateToken(token)) {
                try {
                    UserPrincipal principal = jwtUtils.extractUserPrincipal(token);
                    requestBuilder
                            .header("X-User-Id", principal.getUserId() != null ? principal.getUserId() : "")
                            .header("X-User-Email", principal.getEmail() != null ? principal.getEmail() : "")
                            .header("X-User-Role", principal.getRole() != null ? principal.getRole().name() : Role.CUSTOMER.name());
                } catch (Exception e) {
                    log.warn("Failed to extract principal from token: {}", e.getMessage());
                }
            } else if (!isPublicPath && !isPublicGet) {
                return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
            }
        } else if (!isPublicPath && !isPublicGet) {
            return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
        }

        return chain.filter(exchange.mutate().request(requestBuilder.build()).build());
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String body = String.format("{\"success\":false,\"error\":{\"code\":\"UNAUTHORIZED\",\"message\":\"%s\"}}", message);
        DataBuffer buffer = response.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
