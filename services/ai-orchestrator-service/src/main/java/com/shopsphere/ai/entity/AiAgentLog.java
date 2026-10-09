package com.shopsphere.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "ai_agent_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAgentLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String agentType;

    @Column(nullable = false)
    private String agentName;

    private String customerId;

    private String sessionId;

    @Column(length = 2048)
    private String promptOrIntent;

    @Column(length = 4096)
    private String decisionOrResponse;

    private Double confidenceScore;

    private Long executionLatencyMs;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
