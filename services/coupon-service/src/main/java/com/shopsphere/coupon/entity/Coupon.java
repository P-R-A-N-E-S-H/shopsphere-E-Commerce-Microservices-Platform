package com.shopsphere.coupon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "coupons", indexes = {
        @Index(name = "idx_coupon_code", columnList = "code", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    private String description;

    @Column(nullable = false)
    @Builder.Default
    private String discountType = "PERCENTAGE"; // PERCENTAGE, FIXED

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(precision = 12, scale = 2)
    private BigDecimal minOrderAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Builder.Default
    private int usageLimit = 1000;

    @Builder.Default
    private int timesUsed = 0;

    private Instant validFrom;

    private Instant validUntil;

    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
