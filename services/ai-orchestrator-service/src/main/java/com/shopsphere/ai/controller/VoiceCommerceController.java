package com.shopsphere.ai.controller;

import com.shopsphere.ai.service.SpatialVoiceService;
import com.shopsphere.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai/voice")
@RequiredArgsConstructor
@Tag(name = "AI Spatial Voice Commerce API", description = "Speech-to-intent natural language commerce execution and dynamic voice interactions")
public class VoiceCommerceController {

    private final SpatialVoiceService voiceService;

    @PostMapping("/command")
    @Operation(summary = "Parse voice audio transcript and trigger autonomous storefront actions")
    public ResponseEntity<ApiResponse<SpatialVoiceService.VoiceCommandResponse>> processVoiceCommand(
            @RequestBody SpatialVoiceService.VoiceCommandRequest request) {
        SpatialVoiceService.VoiceCommandResponse response = voiceService.parseVoiceCommand(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Voice command interpreted"));
    }
}
