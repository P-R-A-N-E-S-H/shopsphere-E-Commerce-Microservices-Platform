package com.shopsphere.search.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.ProductEvents;
import com.shopsphere.search.entity.SearchProduct;
import com.shopsphere.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductEventConsumer {

    private final SearchService searchService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.PRODUCT_EVENTS, groupId = "search-service-group")
    public void consume(String message) {
        try {
            BaseEvent<Object> baseEvent = objectMapper.readValue(message, new TypeReference<>() {});
            String eventType = baseEvent.getEventType();

            if ("PRODUCT_CREATED".equals(eventType)) {
                ProductEvents.ProductCreatedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), ProductEvents.ProductCreatedPayload.class
                );
                SearchProduct product = SearchProduct.builder()
                        .id(UUID.fromString(payload.getProductId()))
                        .sku(payload.getSku())
                        .name(payload.getName())
                        .slug(payload.getSlug())
                        .description(payload.getDescription())
                        .price(payload.getPrice())
                        .discountPrice(payload.getDiscountPrice())
                        .categoryId(payload.getCategoryId() != null ? UUID.fromString(payload.getCategoryId()) : null)
                        .categoryName(payload.getCategoryName())
                        .brand(payload.getBrand())
                        .images(payload.getImages())
                        .status("ACTIVE")
                        .build();
                searchService.indexProduct(product);
            } else if ("PRODUCT_DELETED".equals(eventType)) {
                ProductEvents.ProductDeletedPayload payload = objectMapper.convertValue(
                        baseEvent.getPayload(), ProductEvents.ProductDeletedPayload.class
                );
                searchService.deleteProduct(UUID.fromString(payload.getProductId()));
            }
        } catch (Exception e) {
            log.error("Failed to process product event in search-service: {}", e.getMessage());
        }
    }
}
