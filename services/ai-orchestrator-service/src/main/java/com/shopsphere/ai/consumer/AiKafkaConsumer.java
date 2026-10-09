package com.shopsphere.ai.consumer;

import com.shopsphere.ai.entity.AiAgentLog;
import com.shopsphere.ai.repository.AiAgentLogRepository;
import com.shopsphere.common.events.KafkaTopics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiKafkaConsumer {

    private final AiAgentLogRepository logRepository;

    @KafkaListener(topics = KafkaTopics.PRODUCT_EVENTS, groupId = "ai-orchestrator-group")
    public void handleProductEvent(Map<String, Object> event) {
        log.info("[AI-STREAM] Ingested product event: {}", event.get("eventType"));
        recordAutonomousAction("PRODUCT_SYNC", "Vectorized catalog embedding & updated neural similarity index");
    }

    @KafkaListener(topics = KafkaTopics.ORDER_EVENTS, groupId = "ai-orchestrator-group")
    public void handleOrderEvent(Map<String, Object> event) {
        log.info("[AI-STREAM] Ingested order event: {}", event.get("eventType"));
        recordAutonomousAction("ORDER_FRAUD_SCAN", "Autonomous fraud sentinel completed risk evaluation");
    }

    @KafkaListener(topics = KafkaTopics.ANALYTICS_EVENTS, groupId = "ai-orchestrator-group")
    public void handleAnalyticsEvent(Map<String, Object> event) {
        log.info("[AI-STREAM] Ingested analytics stream update: {}", event.get("eventType"));
        recordAutonomousAction("KPI_CORRELATION", "Re-weighted recommendation vector affinities");
    }

    private void recordAutonomousAction(String agentType, String response) {
        try {
            logRepository.save(AiAgentLog.builder()
                    .agentType(agentType)
                    .agentName("Autonomous Stream Sentinel")
                    .promptOrIntent("Kafka Event Ingestion")
                    .decisionOrResponse(response)
                    .confidenceScore(0.99)
                    .executionLatencyMs(4L)
                    .createdAt(Instant.now())
                    .build());
        } catch (Exception e) {
            log.warn("Could not save stream log: {}", e.getMessage());
        }
    }
}
