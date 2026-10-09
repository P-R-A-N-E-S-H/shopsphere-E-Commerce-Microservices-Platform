package com.shopsphere.ai.controller;

import com.shopsphere.ai.service.AutonomousSupplyChainService;
import com.shopsphere.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai/supply-chain")
@RequiredArgsConstructor
@Tag(name = "AI Autonomous Supply Chain API", description = "Predictive inventory restock, demand velocity surge modeling, and auto-PO triggers")
public class SupplyChainAgentController {

    private final AutonomousSupplyChainService supplyChainService;

    @GetMapping("/forecasts")
    @Operation(summary = "Get real-time AI inventory demand forecasts and automated reorder actions")
    public ResponseEntity<ApiResponse<List<AutonomousSupplyChainService.RestockForecastDTO>>> getRestockForecasts() {
        List<AutonomousSupplyChainService.RestockForecastDTO> forecasts = supplyChainService.evaluateAutonomousRestock();
        return ResponseEntity.ok(ApiResponse.success(forecasts, "Supply chain forecasts generated"));
    }
}
