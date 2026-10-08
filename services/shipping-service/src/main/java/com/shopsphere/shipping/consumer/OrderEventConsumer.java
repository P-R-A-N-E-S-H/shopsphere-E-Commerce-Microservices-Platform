package com.shopsphere.shipping.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.OrderEvents;
import com.shopsphere.shipping.service.ShippingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final ShippingService shippingService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.ORDER_EVENTS, groupId = "shipping-order-group")
    public void consume(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            String eventType = baseEvent.getEventType();

            if ("ORDER_CREATED".equals(eventType)) {
                OrderEvents.OrderCreatedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), OrderEvents.OrderCreatedPayload.class
                );
                shippingService.createShipmentForOrder(payload.getOrderId(), payload.getCustomerId(), payload.getShippingAddress());
            }
        } catch (Exception e) {
            log.error("Failed to process order event in shipping-service: {}", e.getMessage());
        }
    }
}
