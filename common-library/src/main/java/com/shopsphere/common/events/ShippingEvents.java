package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

public class ShippingEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingCreatedPayload {
        private String shipmentId;
        private String orderId;
        private String customerId;
        private String carrier;
        private String trackingNumber;
        private String status;
        private Instant estimatedDelivery;
        private OrderEvents.ShippingAddressPayload address;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingUpdatedPayload {
        private String shipmentId;
        private String orderId;
        private String status;
        private String currentLocation;
        private String trackingNumber;
        private String note;
    }
}
