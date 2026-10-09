package com.shopsphere.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public final class AIDTOs {

    private AIDTOs() {}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AIChatRequest {
        private String message;
        private String sessionId;
        private String customerId;
        private String customerTier; // BRONZE, SILVER, GOLD, PLATINUM, VIP
        private List<ChatMessageDTO> conversationHistory;
        private String voiceMode;
        private Map<String, Object> contextMetadata;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessageDTO {
        private String sender; // USER, AGENT, SYSTEM, TOOL
        private String text;
        private String timestamp;
        private List<AgentToolCallDTO> toolCalls;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgentToolCallDTO {
        private String toolName;
        private String toolInput;
        private String toolResult;
        private String status;
        private Long latencyMs;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AIChatResponse {
        private String reply;
        private String sessionId;
        private String activeAgent; // OmniCopilot, BargainMerchant, StyleAdvisor, TechGuru
        private List<String> reasoningSteps;
        private List<AgentToolCallDTO> executedTools;
        private List<Map<String, Object>> suggestedProducts;
        private List<String> quickPromptSuggestions;
        private Map<String, Object> metadata;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BargainNegotiateRequest {
        private String productId;
        private String sku;
        private String productName;
        private BigDecimal currentPrice;
        private BigDecimal offeredPrice;
        private Integer quantity;
        private String customerId;
        private String customerLoyaltyTier;
        private String customerNote;
        private Integer round;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BargainNegotiateResponse {
        private String productId;
        private String status; // ACCEPTED, COUNTER_OFFER, REJECTED, MAX_ROUNDS_REACHED
        private BigDecimal acceptedPrice;
        private BigDecimal counterPrice;
        private Double discountPercent;
        private String aiAgentMessage;
        private String generatedCouponCode;
        private Integer validMinutes;
        private Double confidenceScore;
        private List<String> agentPerksIncluded; // e.g. "Free Express Shipping", "2x Loyalty Points"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VisualSearchRequest {
        private String imageUrl;
        private String imageBase64;
        private String categoryHint;
        private Integer maxResults;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VisualSearchResponse {
        private String queryAnalysis;
        private List<String> detectedObjects;
        private List<String> extractedColors; // Hex codes
        private String aestheticStyle; // Minimalist, Cyberpunk, Luxury, Streetwear, Modernist
        private List<VisualMatchProductDTO> matchingProducts;
        private Double visualProcessingTimeMs;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VisualMatchProductDTO {
        private String productId;
        private String name;
        private BigDecimal price;
        private String category;
        private Double similarityScore; // 0.00 - 1.00
        private String matchedFeature;
        private String imageUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SentimentRadarResponse {
        private String productId;
        private String productName;
        private Double overallSentimentScore; // 0.0 - 100.0
        private String sentimentVerdict; // OVERWHELMINGLY_POSITIVE, POSITIVE, NEUTRAL, MIXED, CRITICAL
        private Double returnProbabilityPercent;
        private Map<String, Double> aspectScores; // e.g., Build Quality: 94.0, Value: 88.0, Battery: 91.0
        private List<String> topKeyPositives;
        private List<String> topKeyConcerns;
        private Double verifiedBuyerTrustIndex;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FraudScoreRequest {
        private String orderId;
        private String userId;
        private BigDecimal amount;
        private String ipAddress;
        private String userAgent;
        private String shippingAddress;
        private String billingAddress;
        private Integer itemsCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FraudScoreResponse {
        private Double riskScore; // 0 - 100
        private String verdict; // LOW_RISK, MEDIUM_RISK, HIGH_RISK, BOT_ANOMALY
        private List<String> explainableRiskFactors;
        private String recommendedAction;
        private Long inferenceLatencyMs;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgentSwarmTelemetryDTO {
        private Integer activeAgentsCount;
        private Double totalDecisionsLast24h;
        private Double averageAgentLatencyMs;
        private BigDecimal totalBargainSavingsGenerated;
        private Double fraudPreventionAccuracy;
        private Double neuralRecommendationCTR;
        private List<AgentStatusDTO> agents;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgentStatusDTO {
        private String agentId;
        private String name;
        private String role;
        private String status; // ONLINE, IDLE, PROCESSING, SYNCING
        private Double loadPercent;
        private String lastAction;
    }
}
