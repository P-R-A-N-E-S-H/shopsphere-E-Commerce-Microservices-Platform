package com.shopsphere.payment.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.payment.dto.PaymentResponse;
import com.shopsphere.payment.dto.ProcessPaymentRequest;
import com.shopsphere.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody ProcessPaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(userId, request, idempotencyKey);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment processed successfully", response));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable String paymentId) {
        PaymentResponse response = paymentService.getPaymentByPaymentId(paymentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByOrderId(@PathVariable String orderId) {
        List<PaymentResponse> list = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<PaymentResponse>> refund(
            @PathVariable String paymentId,
            @RequestParam(required = false) BigDecimal amount,
            @RequestParam(required = false) String reason) {
        PaymentResponse response = paymentService.refundPayment(paymentId, amount, reason);
        return ResponseEntity.ok(ApiResponse.success("Refund processed successfully", response));
    }
}
