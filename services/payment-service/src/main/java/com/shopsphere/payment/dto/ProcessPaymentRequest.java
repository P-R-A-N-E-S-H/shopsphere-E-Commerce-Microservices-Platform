package com.shopsphere.payment.dto;

import com.shopsphere.common.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessPaymentRequest {

    @NotBlank(message = "Order ID is required")
    private String orderId;

    private String customerId;

    @NotNull(message = "Amount is required")
    @DecimalMin("0.01")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String idempotencyKey;

    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private String upiId;
}
