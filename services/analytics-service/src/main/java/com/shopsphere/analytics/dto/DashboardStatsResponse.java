package com.shopsphere.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long activeCustomers;
    private BigDecimal averageOrderValue;
    private double conversionRate;
    private double revenueGrowthPercent;
    private Map<String, Long> paymentMethodBreakdown;
}
