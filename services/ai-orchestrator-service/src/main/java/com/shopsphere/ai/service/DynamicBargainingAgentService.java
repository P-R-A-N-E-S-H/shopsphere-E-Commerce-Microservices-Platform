package com.shopsphere.ai.service;

import com.shopsphere.ai.config.AiConfig;
import com.shopsphere.ai.entity.AiAgentLog;
import com.shopsphere.ai.repository.AiAgentLogRepository;
import com.shopsphere.common.dto.AIDTOs;
import com.shopsphere.common.events.AIEvents;
import com.shopsphere.common.events.KafkaTopics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class DynamicBargainingAgentService {

    private final AiConfig aiConfig;
    private final AiAgentLogRepository logRepository;
    private final Optional<KafkaTemplate<String, Object>> kafkaTemplate;

    public AIDTOs.BargainNegotiateResponse negotiatePrice(AIDTOs.BargainNegotiateRequest request) {
        long startTime = System.currentTimeMillis();
        BigDecimal currentPrice = request.getCurrentPrice() != null ? request.getCurrentPrice() : BigDecimal.valueOf(100.00);
        BigDecimal offeredPrice = request.getOfferedPrice() != null ? request.getOfferedPrice() : currentPrice;
        int round = request.getRound() != null ? request.getRound() : 1;
        String tier = request.getCustomerLoyaltyTier() != null ? request.getCustomerLoyaltyTier().toUpperCase() : "BRONZE";

        // Loyalty bonus allowance
        double tierBonusPercent = switch (tier) {
            case "VIP", "PLATINUM" -> 5.0;
            case "GOLD" -> 3.5;
            case "SILVER" -> 2.0;
            default -> 0.0;
        };

        double maxAllowedDiscount = aiConfig.getAgents().getBargaining().getMaxDiscountPercent() + tierBonusPercent;
        BigDecimal minFloorPrice = currentPrice.multiply(BigDecimal.valueOf(1.0 - (maxAllowedDiscount / 100.0)))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal requestedDiscountPercent = currentPrice.subtract(offeredPrice)
                .divide(currentPrice, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100.0));

        AIDTOs.BargainNegotiateResponse response = new AIDTOs.BargainNegotiateResponse();
        response.setProductId(request.getProductId());

        if (offeredPrice.compareTo(minFloorPrice) >= 0) {
            // Offer is within authorized automated merchant margin!
            String couponCode = "BARGAIN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            response.setStatus("ACCEPTED");
            response.setAcceptedPrice(offeredPrice);
            response.setDiscountPercent(requestedDiscountPercent.doubleValue());
            response.setGeneratedCouponCode(couponCode);
            response.setValidMinutes(30);
            response.setConfidenceScore(0.98);
            response.setAiAgentMessage(String.format(
                    "Deal accepted! As a valued %s member, I have authorized your offer of $%s (%.1f%% off). Your single-use checkout code is **%s**.",
                    tier, offeredPrice, requestedDiscountPercent.doubleValue(), couponCode
            ));
            response.setAgentPerksIncluded(List.of("Free Express Delivery", "2x Loyalty Multiplier", "30-Day Price Protection Guarantee"));

        } else if (round < 3) {
            // Counter-offer negotiation logic
            double counterDiscountPercent = (maxAllowedDiscount * 0.75);
            BigDecimal counterPrice = currentPrice.multiply(BigDecimal.valueOf(1.0 - (counterDiscountPercent / 100.0)))
                    .setScale(2, RoundingMode.HALF_UP);

            String couponCode = "COUNTER-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            response.setStatus("COUNTER_OFFER");
            response.setCounterPrice(counterPrice);
            response.setDiscountPercent(counterDiscountPercent);
            response.setGeneratedCouponCode(couponCode);
            response.setValidMinutes(15);
            response.setConfidenceScore(0.91);
            response.setAiAgentMessage(String.format(
                    "Your offer of $%s is below our wholesale margin floor. However, I can meet you at **$%s** (%.1f%% off) + throw in Free Priority Shipping if you lock it in today!",
                    offeredPrice, counterPrice, counterDiscountPercent
            ));
            response.setAgentPerksIncluded(List.of("Free Priority Shipping", "Instant Warranty Extension"));

        } else {
            // Max rounds reached - Best & Final Offer
            BigDecimal finalPrice = minFloorPrice;
            String couponCode = "FINAL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            double finalDiscount = maxAllowedDiscount;
            response.setStatus("COUNTER_OFFER");
            response.setCounterPrice(finalPrice);
            response.setDiscountPercent(finalDiscount);
            response.setGeneratedCouponCode(couponCode);
            response.setValidMinutes(10);
            response.setConfidenceScore(0.95);
            response.setAiAgentMessage(String.format(
                    "This is my final automated merchant clearance price: **$%s** (%.1f%% maximum authorized discount). Promo code **%s** is reserved for your session for the next 10 minutes.",
                    finalPrice, finalDiscount, couponCode
            ));
            response.setAgentPerksIncluded(List.of("Free Express Shipping", "Complimentary Gift Wrapping"));
        }

        long latency = System.currentTimeMillis() - startTime;

        // Persist AI decision log
        try {
            logRepository.save(AiAgentLog.builder()
                    .agentType("BARGAIN_MERCHANT")
                    .agentName("AI Dynamic Pricing Merchant")
                    .customerId(request.getCustomerId())
                    .promptOrIntent("Offered $" + offeredPrice + " on product " + request.getProductId())
                    .decisionOrResponse(response.getAiAgentMessage())
                    .confidenceScore(response.getConfidenceScore())
                    .executionLatencyMs(latency)
                    .build());
        } catch (Exception e) {
            log.warn("Failed to log bargain decision: {}", e.getMessage());
        }

        // Publish dynamic pricing event to Kafka
        kafkaTemplate.ifPresent(kt -> {
            try {
                AIEvents.DynamicPricingEventPayload payload = AIEvents.DynamicPricingEventPayload.builder()
                        .productId(request.getProductId())
                        .sku(request.getSku())
                        .baselinePrice(currentPrice)
                        .optimizedPrice(response.getAcceptedPrice() != null ? response.getAcceptedPrice() : response.getCounterPrice())
                        .elasticityScore(0.85)
                        .pricingStrategy("DYNAMIC_BARGAIN_NEGOTIATION")
                        .reason("Customer negotiated offer round " + round)
                        .authorizedAgentId("agent-bargain-v1")
                        .build();

                kt.send(KafkaTopics.DYNAMIC_PRICING_EVENTS, request.getProductId(), payload);
            } catch (Exception ex) {
                log.warn("Kafka dynamic pricing publish failed: {}", ex.getMessage());
            }
        });

        return response;
    }
}
