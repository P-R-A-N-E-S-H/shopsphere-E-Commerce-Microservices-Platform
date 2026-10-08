package com.shopsphere.order.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.enums.OrderStatus;
import com.shopsphere.common.enums.PaymentStatus;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.InventoryEvents;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryEventConsumer {

    private final OrderService orderService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.INVENTORY_EVENTS, groupId = "order-inventory-group")
    public void consume(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            if ("INVENTORY_RESERVATION_FAILED".equals(baseEvent.getEventType())) {
                InventoryEvents.InventoryReservationFailedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), InventoryEvents.InventoryReservationFailedPayload.class
                );
                orderService.updateStatusFromEvent(payload.getOrderId(), OrderStatus.CANCELLED, PaymentStatus.FAILED, null, null);
            }
        } catch (Exception e) {
            log.error("Failed to process inventory event in order-service: {}", e.getMessage());
        }
    }
}
