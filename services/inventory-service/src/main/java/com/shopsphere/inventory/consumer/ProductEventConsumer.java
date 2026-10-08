package com.shopsphere.inventory.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.ProductEvents;
import com.shopsphere.inventory.dto.RestockRequest;
import com.shopsphere.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductEventConsumer {

    private final InventoryService inventoryService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.PRODUCT_EVENTS, groupId = "inventory-product-group")
    public void consume(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            if ("PRODUCT_CREATED".equals(baseEvent.getEventType())) {
                ProductEvents.ProductCreatedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), ProductEvents.ProductCreatedPayload.class
                );
                inventoryService.restock(RestockRequest.builder()
                        .productId(payload.getProductId())
                        .sku(payload.getSku())
                        .quantity(payload.getInitialStock() > 0 ? payload.getInitialStock() : 100)
                        .build());
            }
        } catch (Exception e) {
            log.error("Failed to process product created in inventory-service: {}", e.getMessage());
        }
    }
}
