package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class AnalyticsEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricPayload {
        private String metricName;
        private BigDecimal value;
        private String dimension;
        private String dimensionValue;
    }
}
