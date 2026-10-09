package com.shopsphere.ai.service;

import com.shopsphere.ai.engine.LLMProviderEngine;
import com.shopsphere.ai.entity.AiAgentLog;
import com.shopsphere.ai.repository.AiAgentLogRepository;
import com.shopsphere.common.dto.AIDTOs;
import com.shopsphere.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class OmniConciergeAgentService {

    private final LLMProviderEngine llmEngine;
    private final AiAgentLogRepository logRepository;

    public AIDTOs.AIChatResponse processChat(AIDTOs.AIChatRequest request) {
        long startTime = System.currentTimeMillis();
        String message = request.getMessage() != null ? request.getMessage() : "";
        String msgLower = message.toLowerCase();

        List<AIDTOs.AgentToolCallDTO> toolCalls = new ArrayList<>();
        List<Map<String, Object>> suggestedProducts = new ArrayList<>();
        List<String> reasoningSteps = llmEngine.synthesizeReasoningTrace("OmniCopilot", message, "Customer Tier: " + request.getCustomerTier());

        String reply;
        String activeAgent = "OmniCopilot AI Concierge";

        // 1. Tool selection & execution logic
        if (msgLower.contains("laptop") || msgLower.contains("macbook") || msgLower.contains("computer")) {
            toolCalls.add(AIDTOs.AgentToolCallDTO.builder()
                    .toolName("vector_catalog_search")
                    .toolInput("query='premium laptops', category='Electronics'")
                    .toolResult("Found 2 top matches: MacBook Pro 16 M3 Max, Dell XPS 15")
                    .status("SUCCESS")
                    .latencyMs(12L)
                    .build());
            
            suggestedProducts.add(createProductSummary("prod-1", "MacBook Pro 16\" M3 Max", 3499.00, 3299.00, "Electronics & Gadgets", "Apple", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", 4.9));
            reply = "I found top-tier powerhouse laptops for you! The **MacBook Pro 16\" M3 Max** is currently discounted to **$3,299** with industry-leading performance and 22h battery life. Would you like me to apply your loyalty perks or negotiate a custom bundle with noise-canceling headphones?";

        } else if (msgLower.contains("headphone") || msgLower.contains("audio") || msgLower.contains("sony") || msgLower.contains("bose")) {
            toolCalls.add(AIDTOs.AgentToolCallDTO.builder()
                    .toolName("audio_spec_comparator")
                    .toolInput("models=['Sony WH-1000XM5', 'Bose QuietComfort Ultra']")
                    .toolResult("Sony: 30h battery, LDAC. Bose: Immersive Spatial Audio.")
                    .status("SUCCESS")
                    .latencyMs(15L)
                    .build());

            suggestedProducts.add(createProductSummary("prod-2", "Sony WH-1000XM5 Wireless Headphones", 399.99, 348.00, "Audio & Sound", "Sony", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", 4.8));
            suggestedProducts.add(createProductSummary("prod-4", "Bose QuietComfort Ultra Earbuds", 299.00, 279.00, "Audio & Sound", "Bose", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80", 4.6));
            reply = "I've analyzed our spatial audio catalog for you. The **Sony WH-1000XM5** ($348.00) delivers class-leading noise cancelation, while the **Bose QC Ultra Earbuds** ($279.00) offer revolutionary spatial audio. You can test both with our interactive Spatial Audio demo!";

        } else if (msgLower.contains("discount") || msgLower.contains("coupon") || msgLower.contains("deal") || msgLower.contains("save") || msgLower.contains("bargain")) {
            toolCalls.add(AIDTOs.AgentToolCallDTO.builder()
                    .toolName("coupon_pricing_optimizer")
                    .toolInput("user_tier='" + request.getCustomerTier() + "', cart_context='ACTIVE'")
                    .toolResult("Verified available promotions: 'AIEXCLUSIVE15' (15% OFF) and 'SAVE20' (20% OFF over $100)")
                    .status("SUCCESS")
                    .latencyMs(8L)
                    .build());

            reply = "Here's an exclusive AI-unlocked discount! Use code **AIEXCLUSIVE15** at checkout for an instant **15% OFF** across all electronics and apparel. You can also click **'Negotiate Price'** on any product page to bargain directly with our AI pricing engine!";

        } else if (msgLower.contains("order") || msgLower.contains("track") || msgLower.contains("shipping") || msgLower.contains("delivery")) {
            toolCalls.add(AIDTOs.AgentToolCallDTO.builder()
                    .toolName("order_telemetry_tracker")
                    .toolInput("customer_id='" + request.getCustomerId() + "'")
                    .toolResult("Latest dispatch: TRK-FEDEX-90218 - In Transit, Expected Delivery in 24h")
                    .status("SUCCESS")
                    .latencyMs(19L)
                    .build());

            reply = "I checked our live shipping mesh. Your latest package (FedEx #TRK-FEDEX-90218) has cleared the automated sorting facility and is scheduled for out-for-delivery tomorrow before 2:00 PM.";

        } else {
            toolCalls.add(AIDTOs.AgentToolCallDTO.builder()
                    .toolName("intent_classifier")
                    .toolInput("message='" + message + "'")
                    .toolResult("Intent: GENERAL_PRODUCT_ADVICE, Sentiment: POSITIVE")
                    .status("SUCCESS")
                    .latencyMs(10L)
                    .build());

            suggestedProducts.add(createProductSummary("prod-5", "Samsung Galaxy S24 Ultra Titanium", 1299.99, 1199.00, "Electronics & Gadgets", "Samsung", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80", 4.8));
            reply = "Hello! I am your **ShopSphere Autonomous AI Concierge**. I can help you find products, compare technical specifications, negotiate prices with our dynamic bargaining engine, track live shipments, or run multimodal visual searches. What are you looking to explore today?";
        }

        long latency = System.currentTimeMillis() - startTime;

        // Persist audit log
        try {
            logRepository.save(AiAgentLog.builder()
                    .agentType("CONCIERGE")
                    .agentName(activeAgent)
                    .customerId(request.getCustomerId())
                    .sessionId(request.getSessionId())
                    .promptOrIntent(message)
                    .decisionOrResponse(reply)
                    .confidenceScore(0.96)
                    .executionLatencyMs(latency)
                    .build());
        } catch (Exception e) {
            log.warn("Could not persist AI agent log: {}", e.getMessage());
        }

        List<String> promptSuggestions = List.of(
                "Find best rated noise-canceling headphones",
                "Negotiate a 15% discount on MacBook Pro",
                "Compare Sony XM5 vs Bose QC Ultra",
                "Show me trending titanium gadgets"
        );

        Map<String, Object> meta = new HashMap<>();
        meta.put("model", "ShopSphere-AgentSwarm-v2");
        meta.put("inferenceLatencyMs", latency);
        meta.put("tokensUsed", 184);

        return AIDTOs.AIChatResponse.builder()
                .reply(reply)
                .sessionId(request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString())
                .activeAgent(activeAgent)
                .reasoningSteps(reasoningSteps)
                .executedTools(toolCalls)
                .suggestedProducts(suggestedProducts)
                .quickPromptSuggestions(promptSuggestions)
                .metadata(meta)
                .build();
    }

    private Map<String, Object> createProductSummary(String id, String name, double price, double discountPrice, String category, String brand, String image, double rating) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("name", name);
        map.put("price", price);
        map.put("discountPrice", discountPrice);
        map.put("categoryName", category);
        map.put("brand", brand);
        map.put("image", image);
        map.put("rating", rating);
        return map;
    }
}
