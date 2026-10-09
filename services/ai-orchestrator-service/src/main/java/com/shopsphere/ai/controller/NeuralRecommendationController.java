package com.shopsphere.ai.controller;

import com.shopsphere.ai.service.NeuralRecommendationService;
import com.shopsphere.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai/recommendations")
@RequiredArgsConstructor
@Tag(name = "AI Neural Recommendations & Affinity Graph API", description = "Vector similarity embeddings, neural cluster analysis, and smart bundles")
public class NeuralRecommendationController {

    private final NeuralRecommendationService recommendationService;

    @GetMapping("/neural")
    @Operation(summary = "Get personalized neural graph recommendations and smart bundle synergy")
    public ResponseEntity<ApiResponse<NeuralRecommendationService.NeuralRecommendationResult>> getNeuralRecommendations(
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String productId) {
        NeuralRecommendationService.NeuralRecommendationResult result = recommendationService.getPersonalizedGraph(customerId, productId);
        return ResponseEntity.ok(ApiResponse.success(result, "Neural recommendation graph generated"));
    }
}
