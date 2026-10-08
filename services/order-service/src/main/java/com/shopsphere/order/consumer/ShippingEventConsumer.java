package com.shopsphere.order.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.enums.OrderStatus;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.ShippingEvents;
import com.shopsphere.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ShippingEventConsumer {

    private final OrderService orderService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.SHIPPING_EVENTS, groupId = "order-shipping-group")
    public void consume(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            String eventType = baseEvent.getEventType();

            if ("SHIPPING_CREATED".equals(eventType)) {
                ShippingEvents.ShippingCreatedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), ShippingEvents.ShippingCreatedPayload.class
                );
                orderService.updateStatusFromEvent(payload.getOrderId(), OrderStatus.PROCESSING, null, payload.getTrackingNumber(), payload.getCarrier());
            } else if ("SHIPPING_UPDATED".equals(eventType)) {
                ShippingEvents.ShippingUpdatedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), ShippingEvents.ShippingUpdatedPayload.class
                );
                OrderStatus newStatus = "DELIVERED".equalsIgnoreCase(payload.getStatus()) ? OrderStatus.DELIVERED : OrderStatus.SHIPPED;
                orderService.updateStatusFromEvent(payload.getOrderId(), newStatus, null, payload.getTrackingNumber(), null);
            }
        } catch (Exception e) {
            log.error("Failed to process shipping event in order-service: {}", e.getMessage());
        }
    }
}
