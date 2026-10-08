package com.shopsphere.order.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.enums.OrderStatus;
import com.shopsphere.common.enums.PaymentStatus;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.PaymentEvents;
import com.shopsphere.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final OrderService orderService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.PAYMENT_EVENTS, groupId = "order-payment-group")
    public void consume(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            String eventType = baseEvent.getEventType();

            if ("PAYMENT_SUCCESS".equals(eventType)) {
                PaymentEvents.PaymentSuccessPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), PaymentEvents.PaymentSuccessPayload.class
                );
                orderService.updateStatusFromEvent(payload.getOrderId(), OrderStatus.CONFIRMED, PaymentStatus.SUCCESS, null, null);
            } else if ("PAYMENT_FAILED".equals(eventType)) {
                PaymentEvents.PaymentFailedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), PaymentEvents.PaymentFailedPayload.class
                );
                orderService.updateStatusFromEvent(payload.getOrderId(), OrderStatus.PAYMENT_FAILED, PaymentStatus.FAILED, null, null);
            }
        } catch (Exception e) {
            log.error("Failed to process payment event in order-service: {}", e.getMessage());
        }
    }
}
