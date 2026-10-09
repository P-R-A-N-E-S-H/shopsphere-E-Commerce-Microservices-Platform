package com.shopsphere.ai.service;

import com.shopsphere.ai.entity.AiAgentLog;
import com.shopsphere.ai.repository.AiAgentLogRepository;
import com.shopsphere.common.events.AIEvents;
import com.shopsphere.common.events.KafkaTopics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutonomousSupplyChainService {

    private final AiAgentLogRepository logRepository;
    private final Optional<KafkaTemplate<String, Object>> kafkaTemplate;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RestockForecastDTO {
        private String productId;
        private String sku;
        private String productName;
        private Integer currentStock;
        private Integer predictedVelocityNext7d;
        private Integer recommendedReorderQty;
        private Double stockoutProbability;
        private String supplierHealth; // OPTIMAL, CONGESTED, CRITICAL
        private String actionStatus; // AUTO_TRIGGERED, WATCHLIST, HEALTHY
        private String reasoningSummary;
    }

    public List<RestockForecastDTO> evaluateAutonomousRestock() {
        List<RestockForecastDTO> forecasts = new ArrayList<>();

        forecasts.add(RestockForecastDTO.builder()
                .productId("prod-2")
                .sku("SKU-SNY-WH1000XM5")
                .productName("Sony WH-1000XM5 Wireless Headphones")
                .currentStock(14)
                .predictedVelocityNext7d(38)
                .recommendedReorderQty(100)
                .stockoutProbability(88.4)
                .supplierHealth("OPTIMAL")
                .actionStatus("AUTO_TRIGGERED")
                .reasoningSummary("Demand velocity increased 42% over past 48h due to creator promotions. Auto-dispatched supplier PO #PO-AI-88392.")
                .build());

        forecasts.add(RestockForecastDTO.builder()
                .productId("prod-1")
                .sku("SKU-APPL-MBP-16")
                .productName("MacBook Pro 16\" M3 Max")
                .currentStock(45)
                .predictedVelocityNext7d(22)
                .recommendedReorderQty(50)
                .stockoutProbability(24.1)
                .supplierHealth("OPTIMAL")
                .actionStatus("HEALTHY")
                .reasoningSummary("Stock runway is 14.3 days at current sales trajectory. No urgent PO required.")
                .build());

        forecasts.add(RestockForecastDTO.builder()
                .productId("prod-3")
                .sku("SKU-NIKE-AF1-07")
                .productName("Nike Air Force 1 '07 Pro")
                .currentStock(8)
                .predictedVelocityNext7d(45)
                .recommendedReorderQty(150)
                .stockoutProbability(94.7)
                .supplierHealth("CONGESTED")
                .actionStatus("AUTO_TRIGGERED")
                .reasoningSummary("Critical stockout risk (< 2 days buffer). Autonomous buffer reservation placed with regional fulfillment center.")
                .build());

        // Emit Kafka restock event for top urgent item
        kafkaTemplate.ifPresent(kt -> {
            try {
                AIEvents.AutonomousRestockEventPayload payload = AIEvents.AutonomousRestockEventPayload.builder()
                        .productId("prod-2")
                        .sku("SKU-SNY-WH1000XM5")
                        .currentStock(14)
                        .predictedDemandNext7Days(38)
                        .recommendedReorderQuantity(100)
                        .stockoutRiskPercent(88.4)
                        .supplierId("SUPPLIER-SONY-DIRECT")
                        .urgencyLevel("HIGH")
                        .build();

                kt.send(KafkaTopics.AUTONOMOUS_RESTOCK_EVENTS, "prod-2", payload);
            } catch (Exception e) {
                log.warn("Kafka restock publish failed: {}", e.getMessage());
            }
        });

        return forecasts;
    }
}
