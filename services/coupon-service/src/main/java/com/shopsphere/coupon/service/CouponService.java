package com.shopsphere.coupon.service;

import com.shopsphere.common.exception.ConflictException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.coupon.dto.CouponDto;
import com.shopsphere.coupon.dto.CouponValidateRequest;
import com.shopsphere.coupon.dto.CouponValidateResponse;
import com.shopsphere.coupon.entity.Coupon;
import com.shopsphere.coupon.repository.CouponRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @PostConstruct
    @Transactional
    public void seedCoupons() {
        if (couponRepository.count() > 0) {
            return;
        }

        couponRepository.save(Coupon.builder()
                .code("WELCOME10")
                .description("10% off on your first order")
                .discountType("PERCENTAGE")
                .discountValue(new BigDecimal("10.00"))
                .minOrderAmount(new BigDecimal("20.00"))
                .maxDiscountAmount(new BigDecimal("50.00"))
                .usageLimit(10000)
                .validFrom(Instant.now())
                .validUntil(Instant.now().plus(365, ChronoUnit.DAYS))
                .active(true)
                .build());

        couponRepository.save(Coupon.builder()
                .code("SAVE20")
                .description("20% off on orders above $100")
                .discountType("PERCENTAGE")
                .discountValue(new BigDecimal("20.00"))
                .minOrderAmount(new BigDecimal("100.00"))
                .maxDiscountAmount(new BigDecimal("100.00"))
                .usageLimit(5000)
                .validFrom(Instant.now())
                .validUntil(Instant.now().plus(365, ChronoUnit.DAYS))
                .active(true)
                .build());

        couponRepository.save(Coupon.builder()
                .code("FLAT50")
                .description("Flat $50 off on premium orders above $250")
                .discountType("FIXED")
                .discountValue(new BigDecimal("50.00"))
                .minOrderAmount(new BigDecimal("250.00"))
                .usageLimit(2000)
                .validFrom(Instant.now())
                .validUntil(Instant.now().plus(365, ChronoUnit.DAYS))
                .active(true)
                .build());

        log.info("Initialized promotional coupons catalog.");
    }

    @Transactional(readOnly = true)
    public CouponValidateResponse validateCoupon(CouponValidateRequest request) {
        String code = request.getCode().trim().toUpperCase();
        Optional<Coupon> opt = couponRepository.findByCodeIgnoreCase(code);

        if (opt.isEmpty()) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Invalid coupon code")
                    .build();
        }

        Coupon coupon = opt.get();

        if (!coupon.isActive()) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Coupon is inactive")
                    .build();
        }

        if (coupon.getValidUntil() != null && Instant.now().isAfter(coupon.getValidUntil())) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Coupon has expired")
                    .build();
        }

        if (coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Coupon usage limit reached")
                    .build();
        }

        if (coupon.getMinOrderAmount() != null && request.getOrderAmount().compareTo(coupon.getMinOrderAmount()) < 0) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .code(code)
                    .message(String.format("Minimum order amount of $%.2f required to use this coupon", coupon.getMinOrderAmount()))
                    .build();
        }

        BigDecimal discountAmount;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = request.getOrderAmount().multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
            if (coupon.getMaxDiscountAmount() != null && discountAmount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discountAmount = coupon.getMaxDiscountAmount();
            }
        } else {
            discountAmount = coupon.getDiscountValue();
        }

        if (discountAmount.compareTo(request.getOrderAmount()) > 0) {
            discountAmount = request.getOrderAmount();
        }

        BigDecimal finalAmount = request.getOrderAmount().subtract(discountAmount);

        return CouponValidateResponse.builder()
                .valid(true)
                .code(coupon.getCode())
                .description(coupon.getDescription())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .message("Coupon applied successfully")
                .build();
    }

    @Transactional(readOnly = true)
    public List<CouponDto> getActiveCoupons() {
        return couponRepository.findByActiveTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public CouponDto createCoupon(CouponDto dto) {
        if (couponRepository.existsByCodeIgnoreCase(dto.getCode())) {
            throw new ConflictException("Coupon code already exists");
        }

        Coupon coupon = Coupon.builder()
                .code(dto.getCode().toUpperCase().trim())
                .description(dto.getDescription())
                .discountType(dto.getDiscountType().toUpperCase())
                .discountValue(dto.getDiscountValue())
                .minOrderAmount(dto.getMinOrderAmount())
                .maxDiscountAmount(dto.getMaxDiscountAmount())
                .usageLimit(dto.getUsageLimit() > 0 ? dto.getUsageLimit() : 1000)
                .validFrom(dto.getValidFrom() != null ? dto.getValidFrom() : Instant.now())
                .validUntil(dto.getValidUntil())
                .active(dto.isActive())
                .build();

        return toDto(couponRepository.save(coupon));
    }

    @Transactional
    public void deleteCoupon(UUID id) {
        couponRepository.deleteById(id);
    }

    private CouponDto toDto(Coupon c) {
        return CouponDto.builder()
                .id(c.getId())
                .code(c.getCode())
                .description(c.getDescription())
                .discountType(c.getDiscountType())
                .discountValue(c.getDiscountValue())
                .minOrderAmount(c.getMinOrderAmount())
                .maxDiscountAmount(c.getMaxDiscountAmount())
                .usageLimit(c.getUsageLimit())
                .timesUsed(c.getTimesUsed())
                .validFrom(c.getValidFrom())
                .validUntil(c.getValidUntil())
                .active(c.isActive())
                .build();
    }
}
