package com.shopsphere.payment.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.enums.PaymentMethod;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.OrderEvents;
import com.shopsphere.payment.dto.ProcessPaymentRequest;
import com.shopsphere.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.ORDER_EVENTS, groupId = "payment-order-group")
    public void consume(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            if ("ORDER_CREATED".equals(baseEvent.getEventType())) {
                OrderEvents.OrderCreatedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), OrderEvents.OrderCreatedPayload.class
                );

                PaymentMethod method = PaymentMethod.valueOf(payload.getPaymentMethod());
                paymentService.processPayment(
                        payload.getCustomerId(),
                        ProcessPaymentRequest.builder()
                                .orderId(payload.getOrderId())
                                .customerId(payload.getCustomerId())
                                .amount(payload.getTotalAmount())
                                .paymentMethod(method)
                                .idempotencyKey("AUTO-ORDER-" + payload.getOrderId())
                                .build(),
                        null
                );
            }
        } catch (Exception e) {
            log.error("Failed to process order created in payment-service: {}", e.getMessage());
        }
    }
}
