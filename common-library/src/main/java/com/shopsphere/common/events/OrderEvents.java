package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class OrderEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemPayload {
        private String productId;
        private String productName;
        private String sku;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingAddressPayload {
        private String street;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private String phoneNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderCreatedPayload {
        private String orderId;
        private String customerId;
        private String customerEmail;
        private List<OrderItemPayload> items;
        private BigDecimal subtotal;
        private BigDecimal discount;
        private BigDecimal tax;
        private BigDecimal shippingFee;
        private BigDecimal totalAmount;
        private String couponCode;
        private String paymentMethod;
        private ShippingAddressPayload shippingAddress;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderConfirmedPayload {
        private String orderId;
        private String customerId;
        private String customerEmail;
        private BigDecimal totalAmount;
        private List<OrderItemPayload> items;
        private ShippingAddressPayload shippingAddress;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderCancelledPayload {
        private String orderId;
        private String customerId;
        private String customerEmail;
        private String reason;
        private List<OrderItemPayload> items;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderShippedPayload {
        private String orderId;
        private String customerId;
        private String customerEmail;
        private String trackingNumber;
        private String carrier;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderDeliveredPayload {
        private String orderId;
        private String customerId;
        private String customerEmail;
    }
}
