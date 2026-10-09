package com.shopsphere.ai.controller;

import com.shopsphere.ai.entity.AiAgentLog;
import com.shopsphere.ai.repository.AiAgentLogRepository;
import com.shopsphere.ai.service.OmniConciergeAgentService;
import com.shopsphere.common.dto.AIDTOs;
import com.shopsphere.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Orchestrator & Multi-Agent Swarm API", description = "Endpoints for Conversational AI, Bargaining Engine, Multimodal Search, and Swarm Telemetry")
public class OmniAgentController {

    private final OmniConciergeAgentService conciergeAgentService;
    private final AiAgentLogRepository agentLogRepository;

    @PostMapping("/chat")
    @Operation(summary = "Interact with Autonomous AI Concierge with Tool-Execution")
    public ResponseEntity<ApiResponse<AIDTOs.AIChatResponse>> chatWithAgent(@RequestBody AIDTOs.AIChatRequest request) {
        AIDTOs.AIChatResponse response = conciergeAgentService.processChat(request);
        return ResponseEntity.ok(ApiResponse.success(response, "AI response synthesized successfully"));
    }

    @GetMapping("/telemetry/logs")
    @Operation(summary = "Get recent AI Agent execution logs and telemetry trace")
    public ResponseEntity<ApiResponse<List<AiAgentLog>>> getRecentAgentLogs() {
        List<AiAgentLog> logs = agentLogRepository.findTop20ByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.success(logs, "Recent AI agent logs retrieved"));
    }
}
