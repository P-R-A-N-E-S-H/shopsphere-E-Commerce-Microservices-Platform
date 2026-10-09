package com.shopsphere.ai.controller;

import com.shopsphere.ai.service.FraudRadarAgentService;
import com.shopsphere.common.dto.AIDTOs;
import com.shopsphere.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai/fraud")
@RequiredArgsConstructor
@Tag(name = "AI Fraud & Anomaly Radar API", description = "Real-time neural risk scoring, transaction threat detection, and bot anomaly mitigation")
public class FraudAgentController {

    private final FraudRadarAgentService fraudService;

    @PostMapping("/evaluate")
    @Operation(summary = "Evaluate transaction risk score and obtain explainable AI threat factors")
    public ResponseEntity<ApiResponse<AIDTOs.FraudScoreResponse>> evaluateTransactionRisk(
            @RequestBody AIDTOs.FraudScoreRequest request) {
        AIDTOs.FraudScoreResponse response = fraudService.evaluateTransaction(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Fraud risk evaluated"));
    }
}
