package com.shopsphere.ai.service;

import com.shopsphere.common.dto.AIDTOs;
import com.shopsphere.common.events.AIEvents;
import com.shopsphere.common.events.KafkaTopics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiStreamPublisherService {

    private final Optional<KafkaTemplate<String, Object>> kafkaTemplate;

    public void emitAgentDecision(String agentName, String intent, String action, double confidence, long latencyMs) {
        kafkaTemplate.ifPresent(kt -> {
            try {
                AIEvents.AgentDecisionEventPayload payload = AIEvents.AgentDecisionEventPayload.builder()
                        .agentId("agent-" + UUID.randomUUID().toString().substring(0, 8))
                        .agentName(agentName)
                        .agentType(agentName.toUpperCase().replace(" ", "_"))
                        .intent(intent)
                        .actionExecuted(action)
                        .confidenceScore(confidence)
                        .executionTimeMs(latencyMs)
                        .build();

                kt.send(KafkaTopics.AI_INSIGHTS_EVENTS, UUID.randomUUID().toString(), payload);
                log.info("[AI-STREAM] Published agent decision for: {}", agentName);
            } catch (Exception e) {
                log.warn("Failed to publish AI agent decision: {}", e.getMessage());
            }
        });
    }

    public AIDTOs.AgentSwarmTelemetryDTO getSwarmTelemetry() {
        List<AIDTOs.AgentStatusDTO> agents = List.of(
                AIDTOs.AgentStatusDTO.builder()
                        .agentId("agent-concierge-01")
                        .name("OmniCopilot AI Concierge")
                        .role("Customer Journey & Conversational Tool Executor")
                        .status("ONLINE")
                        .loadPercent(18.5)
                        .lastAction("Executed vector catalog search for noise-canceling headsets")
                        .build(),
                AIDTOs.AgentStatusDTO.builder()
                        .agentId("agent-bargain-02")
                        .name("Dynamic Pricing Merchant")
                        .role("Real-Time Margin Negotiation & Dynamic Bundling")
                        .status("ONLINE")
                        .loadPercent(24.2)
                        .lastAction("Authorized 14% discount for VIP member on MacBook Pro")
                        .build(),
                AIDTOs.AgentStatusDTO.builder()
                        .agentId("agent-vision-03")
                        .name("Multimodal Vision Sentinel")
                        .role("Deep Image Feature Extraction & AR Fit Guidance")
                        .status("ONLINE")
                        .loadPercent(12.0)
                        .lastAction("Extracted color palette [#1A1A1A, #C5A059] for audio search")
                        .build(),
                AIDTOs.AgentStatusDTO.builder()
                        .agentId("agent-fraud-04")
                        .name("Neural Fraud Sentinel")
                        .role("Sub-10ms Transaction Threat & Bot Anomaly Detection")
                        .status("ONLINE")
                        .loadPercent(31.4)
                        .lastAction("Evaluated 48 checkout sessions; zero false positives flagged")
                        .build(),
                AIDTOs.AgentStatusDTO.builder()
                        .agentId("agent-supply-05")
                        .name("Autonomous Restock Forecaster")
                        .role("Demand Spike Velocity & Supplier PO Dispatch")
                        .status("ONLINE")
                        .loadPercent(8.9)
                        .lastAction("Generated restock batch for Nike Air Force 1 buffer")
                        .build(),
                AIDTOs.AgentStatusDTO.builder()
                        .agentId("agent-sentiment-06")
                        .name("Sentiment & Return Radar")
                        .role("Aspect-Based Review Ingestion & Trust Index Engine")
                        .status("ONLINE")
                        .loadPercent(15.1)
                        .lastAction("Aggregated 128 verified ratings for Apple M3 Max cluster")
                        .build()
        );

        return AIDTOs.AgentSwarmTelemetryDTO.builder()
                .activeAgentsCount(6)
                .totalDecisionsLast24h(14280.0)
                .averageAgentLatencyMs(11.4)
                .totalBargainSavingsGenerated(BigDecimal.valueOf(18420.50))
                .fraudPreventionAccuracy(99.94)
                .neuralRecommendationCTR(18.7)
                .agents(agents)
                .build();
    }
}
