package com.shopsphere.analytics.controller;

import com.shopsphere.analytics.dto.DashboardStatsResponse;
import com.shopsphere.analytics.dto.SalesTrendResponse;
import com.shopsphere.analytics.dto.TopProductResponse;
import com.shopsphere.analytics.service.AnalyticsService;
import com.shopsphere.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/sales-trend")
    public ResponseEntity<ApiResponse<SalesTrendResponse>> getSalesTrend() {
        SalesTrendResponse trend = analyticsService.getSalesTrend();
        return ResponseEntity.ok(ApiResponse.success(trend));
    }

    @GetMapping("/top-products")
    public ResponseEntity<ApiResponse<List<TopProductResponse>>> getTopProducts() {
        List<TopProductResponse> products = analyticsService.getTopProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getCategoryBreakdown() {
        Map<String, BigDecimal> breakdown = analyticsService.getCategoryBreakdown();
        return ResponseEntity.ok(ApiResponse.success(breakdown));
    }
}
