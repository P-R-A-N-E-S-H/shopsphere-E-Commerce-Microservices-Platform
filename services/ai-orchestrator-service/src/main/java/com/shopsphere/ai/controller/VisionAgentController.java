package com.shopsphere.ai.controller;

import com.shopsphere.ai.service.MultimodalVisionService;
import com.shopsphere.common.dto.AIDTOs;
import com.shopsphere.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai/vision")
@RequiredArgsConstructor
@Tag(name = "AI Multimodal Vision API", description = "Visual search, aesthetic tagging, color palette extraction, and AR fit matching")
public class VisionAgentController {

    private final MultimodalVisionService visionService;

    @PostMapping("/search")
    @Operation(summary = "Perform multimodal visual search and feature extraction from product images")
    public ResponseEntity<ApiResponse<AIDTOs.VisualSearchResponse>> searchByImage(
            @RequestBody AIDTOs.VisualSearchRequest request) {
        AIDTOs.VisualSearchResponse response = visionService.analyzeAndSearch(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Visual search completed successfully"));
    }
}
