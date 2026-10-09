package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public final class AIEvents {

    private AIEvents() {}

    public static final String AGENT_DECISION_RECORDED = "AGENT_DECISION_RECORDED";
    public static final String DYNAMIC_PRICE_OPTIMIZED = "DYNAMIC_PRICE_OPTIMIZED";
    public static final String FRAUD_RISK_EVALUATED = "FRAUD_RISK_EVALUATED";
    public static final String DEMAND_SURGE_PREDICTED = "DEMAND_SURGE_PREDICTED";
    public static final String SENTIMENT_ANOMALY_DETECTED = "SENTIMENT_ANOMALY_DETECTED";
    public static final String BARGAIN_ACCEPTED = "BARGAIN_ACCEPTED";

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgentDecisionEventPayload {
        private String agentId;
        private String agentName;
        private String agentType; // CONCIERGE, PRICING, FRAUD, RESTOCK, VISION, VOICE
        private String customerId;
        private String sessionToken;
        private String intent;
        private String actionExecuted;
        private Double confidenceScore;
        private Map<String, Object> telemetryContext;
        private Long executionTimeMs;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DynamicPricingEventPayload {
        private String productId;
        private String sku;
        private BigDecimal baselinePrice;
        private BigDecimal optimizedPrice;
        private Double elasticityScore;
        private String pricingStrategy; // SURGE_OPTIMIZATION, LOYALTY_DYNAMIC, INVENTORY_CLEARANCE, COMPETITOR_MATCH
        private String reason;
        private String authorizedAgentId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FraudAlertEventPayload {
        private String transactionId;
        private String orderId;
        private String userId;
        private Double riskScore; // 0.0 - 100.0
        private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
        private List<String> flaggedAnomalySignals;
        private String recommendedAction; // APPROVE, MANUAL_REVIEW, STEP_UP_AUTH, REJECT
        private Map<String, Object> neuralVectorMeta;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AutonomousRestockEventPayload {
        private String productId;
        private String sku;
        private Integer currentStock;
        private Integer predictedDemandNext7Days;
        private Integer recommendedReorderQuantity;
        private Double stockoutRiskPercent;
        private String supplierId;
        private String urgencyLevel; // NORMAL, HIGH, CRITICAL
    }
}
