package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class InventoryEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryItem {
        private String productId;
        private int quantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryReservedPayload {
        private String orderId;
        private List<InventoryItem> items;
        private String reservationId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryReservationFailedPayload {
        private String orderId;
        private String reason;
        private List<String> unavailableProductIds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryReleasedPayload {
        private String orderId;
        private List<InventoryItem> items;
        private String reason;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryRestockedPayload {
        private String productId;
        private int addedQuantity;
        private int currentAvailableQuantity;
    }
}
