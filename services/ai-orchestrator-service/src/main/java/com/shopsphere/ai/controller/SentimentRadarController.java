package com.shopsphere.ai.controller;

import com.shopsphere.ai.service.SentimentRadarService;
import com.shopsphere.common.dto.AIDTOs;
import com.shopsphere.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai/sentiment")
@RequiredArgsConstructor
@Tag(name = "AI Sentiment & Review Radar API", description = "Aspect-based sentiment analysis, verified buyer trust metrics, and return risk probability")
public class SentimentRadarController {

    private final SentimentRadarService sentimentService;

    @GetMapping("/radar/{productId}")
    @Operation(summary = "Get deep aspect-level sentiment breakdown and return risk score for a product")
    public ResponseEntity<ApiResponse<AIDTOs.SentimentRadarResponse>> getProductSentimentRadar(
            @PathVariable String productId) {
        AIDTOs.SentimentRadarResponse response = sentimentService.analyzeProductSentiment(productId);
        return ResponseEntity.ok(ApiResponse.success(response, "Sentiment radar generated"));
    }
}
