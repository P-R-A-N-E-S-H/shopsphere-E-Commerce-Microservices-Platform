package com.shopsphere.order.dto;

import com.shopsphere.common.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    private String customerEmail;

    @NotEmpty(message = "Items cannot be empty")
    @Valid
    private List<OrderItemDto> items;

    @NotNull(message = "Shipping address is required")
    @Valid
    private ShippingAddressDto shippingAddress;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String couponCode;

    private BigDecimal discount;

    private String notes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        @NotBlank
        private String productId;
        @NotBlank
        private String productName;
        private String sku;
        private String productImage;
        @NotNull
        @DecimalMin("0.01")
        private BigDecimal unitPrice;
        @Min(1)
        private int quantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingAddressDto {
        @NotBlank
        private String recipientName;
        @NotBlank
        private String street;
        @NotBlank
        private String city;
        @NotBlank
        private String state;
        @NotBlank
        private String postalCode;
        @NotBlank
        private String country;
        private String phoneNumber;
    }
}
