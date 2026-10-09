package com.shopsphere.ai.controller;

import com.shopsphere.ai.service.DynamicBargainingAgentService;
import com.shopsphere.common.dto.AIDTOs;
import com.shopsphere.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai/bargain")
@RequiredArgsConstructor
@Tag(name = "AI Dynamic Bargaining & Pricing API", description = "Real-time AI merchant negotiation and margin optimization")
public class BargainAgentController {

    private final DynamicBargainingAgentService bargainingService;

    @PostMapping("/negotiate")
    @Operation(summary = "Submit an offer to negotiate real-time pricing with the AI Merchant Agent")
    public ResponseEntity<ApiResponse<AIDTOs.BargainNegotiateResponse>> negotiatePrice(
            @RequestBody AIDTOs.BargainNegotiateRequest request) {
        AIDTOs.BargainNegotiateResponse response = bargainingService.negotiatePrice(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Bargain offer processed by AI Merchant"));
    }
}
