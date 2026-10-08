package com.shopsphere.payment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.enums.PaymentMethod;
import com.shopsphere.common.enums.PaymentStatus;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.PaymentEvents;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.common.outbox.OutboxEvent;
import com.shopsphere.common.outbox.OutboxEventRepository;
import com.shopsphere.common.outbox.OutboxStatus;
import com.shopsphere.payment.dto.PaymentResponse;
import com.shopsphere.payment.dto.ProcessPaymentRequest;
import com.shopsphere.payment.entity.PaymentTransaction;
import com.shopsphere.payment.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionRepository paymentRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public PaymentResponse processPayment(String customerId, ProcessPaymentRequest request, String headerIdempotencyKey) {
        String idempotencyKey = headerIdempotencyKey != null && !headerIdempotencyKey.isBlank()
                ? headerIdempotencyKey
                : request.getIdempotencyKey();

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            Optional<PaymentTransaction> existing = paymentRepository.findByIdempotencyKey(idempotencyKey);
            if (existing.isPresent()) {
                log.info("Idempotent payment match found for key: {}", idempotencyKey);
                return toResponse(existing.get());
            }
        }

        String paymentId = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String txnRef = "TXN-" + System.currentTimeMillis();

        // Simulate payment logic: fails if card ends with 0000
        boolean isSuccess = true;
        String errorMessage = null;
        if (request.getCardNumber() != null && request.getCardNumber().endsWith("0000")) {
            isSuccess = false;
            errorMessage = "Card was declined by issuing bank";
        }

        PaymentStatus status = isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

        PaymentTransaction transaction = PaymentTransaction.builder()
                .paymentId(paymentId)
                .orderId(request.getOrderId())
                .customerId(customerId != null ? customerId : request.getCustomerId())
                .amount(request.getAmount())
                .currency("USD")
                .paymentMethod(request.getPaymentMethod())
                .status(status)
                .idempotencyKey(idempotencyKey)
                .transactionReference(isSuccess ? txnRef : null)
                .errorMessage(errorMessage)
                .build();

        transaction = paymentRepository.save(transaction);

        if (isSuccess) {
            saveOutboxEvent(
                    transaction.getOrderId(),
                    "PAYMENT_SUCCESS",
                    PaymentEvents.PaymentSuccessPayload.builder()
                            .paymentId(transaction.getPaymentId())
                            .orderId(transaction.getOrderId())
                            .customerId(transaction.getCustomerId())
                            .amount(transaction.getAmount())
                            .paymentMethod(transaction.getPaymentMethod().name())
                            .transactionReference(txnRef)
                            .build()
            );
        } else {
            saveOutboxEvent(
                    transaction.getOrderId(),
                    "PAYMENT_FAILED",
                    PaymentEvents.PaymentFailedPayload.builder()
                            .paymentId(transaction.getPaymentId())
                            .orderId(transaction.getOrderId())
                            .customerId(transaction.getCustomerId())
                            .amount(transaction.getAmount())
                            .reason(errorMessage)
                            .failureCode("CARD_DECLINED")
                            .build()
            );
        }

        return toResponse(transaction);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByPaymentId(String paymentId) {
        PaymentTransaction txn = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "paymentId", paymentId));
        return toResponse(txn);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse refundPayment(String paymentId, BigDecimal amount, String reason) {
        PaymentTransaction txn = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "paymentId", paymentId));

        txn.setStatus(PaymentStatus.REFUNDED);
        txn = paymentRepository.save(txn);

        String refundRef = "REF-" + System.currentTimeMillis();
        saveOutboxEvent(
                txn.getOrderId(),
                "PAYMENT_REFUNDED",
                PaymentEvents.PaymentRefundedPayload.builder()
                        .paymentId(txn.getPaymentId())
                        .orderId(txn.getOrderId())
                        .customerId(txn.getCustomerId())
                        .amount(amount != null ? amount : txn.getAmount())
                        .refundReference(refundRef)
                        .reason(reason != null ? reason : "Customer refund request")
                        .build()
        );

        return toResponse(txn);
    }

    private void saveOutboxEvent(String aggregateId, String eventType, Object payload) {
        try {
            BaseEvent<Object> event = BaseEvent.builder()
                    .eventType(eventType)
                    .aggregateId(aggregateId)
                    .payload(payload)
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("PAYMENT")
                    .aggregateId(aggregateId)
                    .eventType(eventType)
                    .topic(KafkaTopics.PAYMENT_EVENTS)
                    .payload(objectMapper.writeValueAsString(event))
                    .status(OutboxStatus.PENDING)
                    .build();

            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            log.error("Failed to write payment outbox event [{}]: {}", eventType, e.getMessage());
        }
    }

    private PaymentResponse toResponse(PaymentTransaction t) {
        return PaymentResponse.builder()
                .id(t.getId())
                .paymentId(t.getPaymentId())
                .orderId(t.getOrderId())
                .customerId(t.getCustomerId())
                .amount(t.getAmount())
                .currency(t.getCurrency())
                .paymentMethod(t.getPaymentMethod())
                .status(t.getStatus())
                .transactionReference(t.getTransactionReference())
                .errorMessage(t.getErrorMessage())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
