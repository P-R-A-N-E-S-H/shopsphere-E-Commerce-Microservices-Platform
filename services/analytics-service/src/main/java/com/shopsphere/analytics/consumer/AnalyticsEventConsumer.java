package com.shopsphere.analytics.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.analytics.service.AnalyticsService;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.OrderEvents;
import com.shopsphere.common.events.PaymentEvents;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AnalyticsEventConsumer {

    private final AnalyticsService analyticsService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.ORDER_EVENTS, groupId = "analytics-order-group")
    public void consumeOrderEvents(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            String eventType = baseEvent.getEventType();

            if ("ORDER_CREATED".equals(eventType)) {
                OrderEvents.OrderCreatedPayload p = objectMapper.convertValue(baseEvent.getPayload(), OrderEvents.OrderCreatedPayload.class);
                analyticsService.recordOrder(p.getOrderId(), p.getCustomerId(), p.getTotalAmount(), p.getItems().size(), "CREATED", p.getPaymentMethod());

                for (OrderEvents.OrderItemPayload item : p.getItems()) {
                    analyticsService.recordProductSale(item.getProductId(), item.getProductName(), "General", item.getQuantity(), item.getSubtotal());
                }
            } else if ("ORDER_CONFIRMED".equals(eventType)) {
                OrderEvents.OrderConfirmedPayload p = objectMapper.convertValue(baseEvent.getPayload(), OrderEvents.OrderConfirmedPayload.class);
                analyticsService.recordOrder(p.getOrderId(), p.getCustomerId(), p.getTotalAmount(), p.getItems().size(), "CONFIRMED", "CREDIT_CARD");
            }
        } catch (Exception e) {
            log.error("Failed to process order event in analytics-service: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaTopics.PAYMENT_EVENTS, groupId = "analytics-payment-group")
    public void consumePaymentEvents(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            if ("PAYMENT_SUCCESS".equals(baseEvent.getEventType())) {
                PaymentEvents.PaymentSuccessPayload p = objectMapper.convertValue(baseEvent.getPayload(), PaymentEvents.PaymentSuccessPayload.class);
                analyticsService.recordOrder(p.getOrderId(), p.getCustomerId(), p.getAmount(), 1, "PAID", p.getPaymentMethod());
            }
        } catch (Exception e) {
            log.error("Failed to process payment event in analytics-service: {}", e.getMessage());
        }
    }
}
