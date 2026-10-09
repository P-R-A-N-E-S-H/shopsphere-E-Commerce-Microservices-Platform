package com.shopsphere.ai.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SpatialVoiceService {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoiceCommandRequest {
        private String transcribedAudioText;
        private String language;
        private String customerId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoiceCommandResponse {
        private String recognizedIntent; // SEARCH, ADD_TO_CART, BARGAIN, CHECK_ORDER, COMPLAINT
        private Map<String, String> extractedSlots;
        private String spokenSynthesisReply;
        private String directActionTrigger;
        private Map<String, Object> targetPayload;
    }

    public VoiceCommandResponse parseVoiceCommand(VoiceCommandRequest request) {
        String transcript = request.getTranscribedAudioText() != null ? request.getTranscribedAudioText().toLowerCase() : "";

        String intent = "SEARCH";
        Map<String, String> slots = new HashMap<>();
        String spokenReply;
        String actionTrigger = "NAVIGATE_SEARCH";
        Map<String, Object> payload = new HashMap<>();

        if (transcript.contains("negotiate") || transcript.contains("cheaper") || transcript.contains("bargain")) {
            intent = "BARGAIN_OFFER";
            slots.put("action", "NEGOTIATE");
            slots.put("entity", "SONY_WH1000XM5");
            spokenReply = "Opening the AI Bargaining Arena. I'll represent your offer to our automated merchant!";
            actionTrigger = "OPEN_BARGAIN_MODAL";
            payload.put("productId", "prod-2");

        } else if (transcript.contains("cart") || transcript.contains("buy") || transcript.contains("order")) {
            intent = "ADD_TO_CART";
            slots.put("action", "ADD_ITEM");
            slots.put("entity", "MACBOOK_PRO_16");
            spokenReply = "I have staged the MacBook Pro 16\" in your cart with instant free express shipping.";
            actionTrigger = "TRIGGER_ADD_TO_CART";
            payload.put("productId", "prod-1");

        } else if (transcript.contains("compare") || transcript.contains("difference") || transcript.contains("versus")) {
            intent = "COMPARE_SPECS";
            slots.put("item1", "Sony WH-1000XM5");
            slots.put("item2", "Bose QC Ultra");
            spokenReply = "Opening spec comparison matrix. Sony offers 30-hour battery life while Bose provides spatial audio.";
            actionTrigger = "OPEN_COMPARE_MODAL";

        } else {
            intent = "CATALOG_SEARCH";
            slots.put("keyword", transcript);
            spokenReply = "Searching our verified inventory for " + transcript + ". Here are the highest rated matches.";
            actionTrigger = "UPDATE_FILTER";
            payload.put("query", transcript);
        }

        return VoiceCommandResponse.builder()
                .recognizedIntent(intent)
                .extractedSlots(slots)
                .spokenSynthesisReply(spokenReply)
                .directActionTrigger(actionTrigger)
                .targetPayload(payload)
                .build();
    }
}
