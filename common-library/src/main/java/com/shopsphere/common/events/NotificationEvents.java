package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

public class NotificationEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationRequestedPayload {
        private String recipientEmail;
        private String recipientPhone;
        private String recipientUserId;
        private String channel; // EMAIL, SMS, IN_APP
        private String template;
        private String subject;
        private Map<String, Object> templateParams;
    }
}
