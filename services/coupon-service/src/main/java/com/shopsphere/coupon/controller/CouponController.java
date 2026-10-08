package com.shopsphere.coupon.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.coupon.dto.CouponDto;
import com.shopsphere.coupon.dto.CouponValidateRequest;
import com.shopsphere.coupon.dto.CouponValidateResponse;
import com.shopsphere.coupon.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CouponValidateResponse>> validate(@Valid @RequestBody CouponValidateRequest request) {
        CouponValidateResponse response = couponService.validateCoupon(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CouponDto>>> getActiveCoupons() {
        List<CouponDto> coupons = couponService.getActiveCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CouponDto>> createCoupon(@Valid @RequestBody CouponDto dto) {
        CouponDto created = couponService.createCoupon(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Coupon created successfully", created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully", null));
    }
}
