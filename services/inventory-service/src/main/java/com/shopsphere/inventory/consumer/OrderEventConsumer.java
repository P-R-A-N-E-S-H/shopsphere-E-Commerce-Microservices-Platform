package com.shopsphere.inventory.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.OrderEvents;
import com.shopsphere.inventory.dto.ReservationRequest;
import com.shopsphere.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final InventoryService inventoryService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.ORDER_EVENTS, groupId = "inventory-service-group")
    public void consume(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            String eventType = baseEvent.getEventType();

            if ("ORDER_CREATED".equals(eventType)) {
                OrderEvents.OrderCreatedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), OrderEvents.OrderCreatedPayload.class
                );

                List<ReservationRequest.Item> items = payload.getItems().stream().map(i ->
                        ReservationRequest.Item.builder()
                                .productId(i.getProductId())
                                .quantity(i.getQuantity())
                                .build()
                ).collect(Collectors.toList());

                inventoryService.reserveStock(payload.getOrderId(), items);
            } else if ("ORDER_CANCELLED".equals(eventType)) {
                OrderEvents.OrderCancelledPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), OrderEvents.OrderCancelledPayload.class
                );
                inventoryService.releaseStock(payload.getOrderId(), payload.getReason());
            }
        } catch (Exception e) {
            log.error("Failed to process order event in inventory-service: {}", e.getMessage());
        }
    }
}
