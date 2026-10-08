package com.shopsphere.common.security;

import com.shopsphere.common.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtUtils {

    // Minimum 256-bit secret key for HS256 algorithm
    private static final String DEFAULT_SECRET = "ShopSphereSuperSecretKeyForJwtAuthenticationMustBeAtLeast256BitsLong!";
    
    private final SecretKey secretKey;

    public JwtUtils() {
        this(DEFAULT_SECRET);
    }

    public JwtUtils(String secret) {
        String effectiveSecret = (secret == null || secret.length() < 32) ? DEFAULT_SECRET : secret;
        this.secretKey = Keys.hmacShaKeyFor(effectiveSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(String userId, String email, Role role, long expirationMillis) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        claims.put("role", role.name());

        return Jwts.builder()
                .subject(userId)
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(String userId, long expirationMillis) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUserId(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractEmail(String token) {
        return extractClaims(token).get("email", String.class);
    }

    public Role extractRole(String token) {
        String roleStr = extractClaims(token).get("role", String.class);
        return roleStr != null ? Role.valueOf(roleStr) : Role.CUSTOMER;
    }

    public UserPrincipal extractUserPrincipal(String token) {
        Claims claims = extractClaims(token);
        String userId = claims.getSubject();
        String email = claims.get("email", String.class);
        String roleStr = claims.get("role", String.class);
        Role role = roleStr != null ? Role.valueOf(roleStr) : Role.CUSTOMER;

        return UserPrincipal.builder()
                .userId(userId)
                .email(email)
                .role(role)
                .build();
    }
}
