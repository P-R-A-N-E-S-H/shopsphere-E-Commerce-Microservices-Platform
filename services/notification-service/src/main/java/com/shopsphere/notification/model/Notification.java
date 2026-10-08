package com.shopsphere.notification.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification implements Serializable {
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    private String userId;
    private String recipientEmail;
    private String title;
    private String message;
    private String type; // ORDER, PAYMENT, SHIPPING, PROMO, SYSTEM
    @Builder.Default
    private boolean read = false;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
