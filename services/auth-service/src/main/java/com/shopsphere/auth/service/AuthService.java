package com.shopsphere.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.auth.dto.AuthResponse;
import com.shopsphere.auth.dto.LoginRequest;
import com.shopsphere.auth.dto.RefreshTokenRequest;
import com.shopsphere.auth.dto.RegisterRequest;
import com.shopsphere.auth.entity.UserAuth;
import com.shopsphere.auth.repository.UserAuthRepository;
import com.shopsphere.common.enums.Role;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.UserEvents;
import com.shopsphere.common.exception.ConflictException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.common.exception.UnauthorizedException;
import com.shopsphere.common.outbox.OutboxEvent;
import com.shopsphere.common.outbox.OutboxEventRepository;
import com.shopsphere.common.outbox.OutboxStatus;
import com.shopsphere.common.security.JwtUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAuthRepository userAuthRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${jwt.secret:ShopSphereSuperSecretKeyForJwtAuthenticationMustBeAtLeast256BitsLong!}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration:86400000}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;

    private JwtUtils jwtUtils;

    @PostConstruct
    public void init() {
        this.jwtUtils = new JwtUtils(jwtSecret);
        seedDefaultUsers();
    }

    private void seedDefaultUsers() {
        if (!userAuthRepository.existsByEmail("admin@shopsphere.com")) {
            UserAuth admin = UserAuth.builder()
                    .email("admin@shopsphere.com")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .firstName("Admin")
                    .lastName("ShopSphere")
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userAuthRepository.save(admin);
            log.info("Default admin user initialized: admin@shopsphere.com");
        }

        if (!userAuthRepository.existsByEmail("customer@shopsphere.com")) {
            UserAuth customer = UserAuth.builder()
                    .email("customer@shopsphere.com")
                    .passwordHash(passwordEncoder.encode("Customer@123"))
                    .firstName("John")
                    .lastName("Doe")
                    .phone("+1234567890")
                    .role(Role.CUSTOMER)
                    .active(true)
                    .build();
            userAuthRepository.save(customer);
            log.info("Default demo customer user initialized: customer@shopsphere.com");
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userAuthRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new ConflictException("User with email " + request.getEmail() + " already exists");
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.CUSTOMER;

        UserAuth user = UserAuth.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .phone(request.getPhone())
                .role(userRole)
                .active(true)
                .build();

        user = userAuthRepository.save(user);

        // Transactional Outbox Event for UserRegistered
        try {
            UserEvents.UserRegisteredPayload payload = UserEvents.UserRegisteredPayload.builder()
                    .userId(user.getId().toString())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phone(user.getPhone())
                    .role(user.getRole().name())
                    .build();

            BaseEvent<UserEvents.UserRegisteredPayload> event = BaseEvent.<UserEvents.UserRegisteredPayload>builder()
                    .eventType("USER_REGISTERED")
                    .aggregateId(user.getId().toString())
                    .payload(payload)
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("USER")
                    .aggregateId(user.getId().toString())
                    .eventType("USER_REGISTERED")
                    .topic(KafkaTopics.USER_EVENTS)
                    .payload(objectMapper.writeValueAsString(event))
                    .status(OutboxStatus.PENDING)
                    .build();

            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            log.error("Failed to serialize outbox event for user registration", e);
        }

        String accessToken = jwtUtils.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole(), accessTokenExpiration);
        String refreshToken = jwtUtils.generateRefreshToken(user.getId().toString(), refreshTokenExpiration);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserAuth user = userAuthRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String accessToken = jwtUtils.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole(), accessTokenExpiration);
        String refreshToken = jwtUtils.generateRefreshToken(user.getId().toString(), refreshTokenExpiration);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!jwtUtils.validateToken(token)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String userId = jwtUtils.extractUserId(token);
        UserAuth user = userAuthRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!user.isActive()) {
            throw new UnauthorizedException("Account is disabled");
        }

        String newAccessToken = jwtUtils.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole(), accessTokenExpiration);
        return buildAuthResponse(user, newAccessToken, token);
    }

    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                long expiration = accessTokenExpiration / 1000;
                redisTemplate.opsForValue().set("blacklist:" + token, "revoked", Duration.ofSeconds(expiration));
            } catch (Exception e) {
                log.warn("Could not blacklist token in Redis: {}", e.getMessage());
            }
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse.UserDto getUserProfile(String userId) {
        UserAuth user = userAuthRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return AuthResponse.UserDto.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }

    private AuthResponse buildAuthResponse(UserAuth user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId().toString())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .build())
                .build();
    }
}
