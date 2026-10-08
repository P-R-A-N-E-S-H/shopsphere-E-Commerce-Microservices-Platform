package com.shopsphere.coupon.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponDto {
    private UUID id;

    @NotBlank(message = "Code is required")
    private String code;

    private String description;

    @NotBlank(message = "Discount type is required (PERCENTAGE or FIXED)")
    private String discountType;

    @NotNull(message = "Discount value is required")
    @DecimalMin("0.01")
    private BigDecimal discountValue;

    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private int usageLimit;
    private int timesUsed;
    private Instant validFrom;
    private Instant validUntil;
    private boolean active;
}
