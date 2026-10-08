package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class PaymentEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentInitiatedPayload {
        private String paymentId;
        private String orderId;
        private String customerId;
        private BigDecimal amount;
        private String paymentMethod;
        private String idempotencyKey;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentSuccessPayload {
        private String paymentId;
        private String orderId;
        private String customerId;
        private BigDecimal amount;
        private String paymentMethod;
        private String transactionReference;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentFailedPayload {
        private String paymentId;
        private String orderId;
        private String customerId;
        private BigDecimal amount;
        private String reason;
        private String failureCode;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentRefundedPayload {
        private String paymentId;
        private String orderId;
        private String customerId;
        private BigDecimal amount;
        private String refundReference;
        private String reason;
    }
}
