package com.shopsphere.order.dto;

import com.shopsphere.common.enums.OrderStatus;
import com.shopsphere.common.enums.PaymentMethod;
import com.shopsphere.common.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private UUID id;
    private String orderNumber;
    private String customerId;
    private String customerEmail;
    private OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private String couponCode;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String trackingNumber;
    private String carrier;
    private String notes;
    private List<OrderItemResponse> items;
    private ShippingAddressResponse shippingAddress;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private UUID id;
        private String productId;
        private String productName;
        private String sku;
        private String productImage;
        private BigDecimal unitPrice;
        private int quantity;
        private BigDecimal subtotal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingAddressResponse {
        private UUID id;
        private String recipientName;
        private String street;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private String phoneNumber;
    }
}
