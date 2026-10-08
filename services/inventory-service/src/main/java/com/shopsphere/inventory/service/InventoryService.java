package com.shopsphere.inventory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.InventoryEvents;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.exception.BadRequestException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.common.outbox.OutboxEvent;
import com.shopsphere.common.outbox.OutboxEventRepository;
import com.shopsphere.common.outbox.OutboxStatus;
import com.shopsphere.inventory.dto.InventoryResponse;
import com.shopsphere.inventory.dto.ReservationRequest;
import com.shopsphere.inventory.dto.RestockRequest;
import com.shopsphere.inventory.entity.Inventory;
import com.shopsphere.inventory.entity.StockReservation;
import com.shopsphere.inventory.repository.InventoryRepository;
import com.shopsphere.inventory.repository.StockReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final StockReservationRepository stockReservationRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public InventoryResponse getInventory(String productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> createDefaultInventory(productId, null, 100));
        return toResponse(inventory);
    }

    @Transactional
    public InventoryResponse restock(RestockRequest request) {
        Inventory inventory = inventoryRepository.findByProductId(request.getProductId())
                .orElseGet(() -> createDefaultInventory(request.getProductId(), request.getSku(), 0));

        inventory.setAvailableQuantity(inventory.getAvailableQuantity() + request.getQuantity());
        inventory.setTotalQuantity(inventory.getTotalQuantity() + request.getQuantity());
        if (request.getSku() != null) {
            inventory.setSku(request.getSku());
        }
        inventory = inventoryRepository.save(inventory);

        saveOutboxEvent(
                request.getProductId(),
                "INVENTORY_RESTOCKED",
                InventoryEvents.InventoryRestockedPayload.builder()
                        .productId(request.getProductId())
                        .addedQuantity(request.getQuantity())
                        .currentAvailableQuantity(inventory.getAvailableQuantity())
                        .build()
        );

        return toResponse(inventory);
    }

    @Transactional
    public boolean reserveStock(String orderId, List<ReservationRequest.Item> items) {
        List<String> unavailable = new ArrayList<>();
        List<Inventory> toUpdate = new ArrayList<>();

        for (ReservationRequest.Item item : items) {
            Inventory inv = inventoryRepository.findByProductId(item.getProductId())
                    .orElseGet(() -> createDefaultInventory(item.getProductId(), null, 50));

            if (inv.getAvailableQuantity() < item.getQuantity()) {
                unavailable.add(item.getProductId());
            } else {
                inv.setAvailableQuantity(inv.getAvailableQuantity() - item.getQuantity());
                inv.setReservedQuantity(inv.getReservedQuantity() + item.getQuantity());
                toUpdate.add(inv);
            }
        }

        if (!unavailable.isEmpty()) {
            log.warn("Stock reservation failed for order {}. Unavailable: {}", orderId, unavailable);
            saveOutboxEvent(
                    orderId,
                    "INVENTORY_RESERVATION_FAILED",
                    InventoryEvents.InventoryReservationFailedPayload.builder()
                            .orderId(orderId)
                            .reason("Insufficient inventory for products: " + unavailable)
                            .unavailableProductIds(unavailable)
                            .build()
            );
            return false;
        }

        inventoryRepository.saveAll(toUpdate);

        String reservationId = UUID.randomUUID().toString();
        List<StockReservation> reservations = items.stream().map(item -> StockReservation.builder()
                .orderId(orderId)
                .reservationId(reservationId)
                .productId(item.getProductId())
                .quantity(item.getQuantity())
                .status("RESERVED")
                .expiresAt(Instant.now().plus(30, ChronoUnit.MINUTES))
                .build()).collect(Collectors.toList());

        stockReservationRepository.saveAll(reservations);

        List<InventoryEvents.InventoryItem> eventItems = items.stream().map(i ->
                InventoryEvents.InventoryItem.builder().productId(i.getProductId()).quantity(i.getQuantity()).build()
        ).collect(Collectors.toList());

        saveOutboxEvent(
                orderId,
                "INVENTORY_RESERVED",
                InventoryEvents.InventoryReservedPayload.builder()
                        .orderId(orderId)
                        .reservationId(reservationId)
                        .items(eventItems)
                        .build()
        );

        log.info("Stock reserved successfully for order: {}", orderId);
        return true;
    }

    @Transactional
    public void releaseStock(String orderId, String reason) {
        List<StockReservation> reservations = stockReservationRepository.findByOrderIdAndStatus(orderId, "RESERVED");
        if (reservations.isEmpty()) {
            return;
        }

        List<InventoryEvents.InventoryItem> releasedItems = new ArrayList<>();
        for (StockReservation res : reservations) {
            inventoryRepository.findByProductId(res.getProductId()).ifPresent(inv -> {
                inv.setAvailableQuantity(inv.getAvailableQuantity() + res.getQuantity());
                inv.setReservedQuantity(Math.max(0, inv.getReservedQuantity() - res.getQuantity()));
                inventoryRepository.save(inv);
            });
            res.setStatus("RELEASED");
            releasedItems.add(InventoryEvents.InventoryItem.builder()
                    .productId(res.getProductId())
                    .quantity(res.getQuantity())
                    .build());
        }
        stockReservationRepository.saveAll(reservations);

        saveOutboxEvent(
                orderId,
                "INVENTORY_RELEASED",
                InventoryEvents.InventoryReleasedPayload.builder()
                        .orderId(orderId)
                        .items(releasedItems)
                        .reason(reason)
                        .build()
        );

        log.info("Released stock for order: {}", orderId);
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStock(int threshold) {
        return inventoryRepository.findLowStock(threshold).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Inventory createDefaultInventory(String productId, String sku, int quantity) {
        Inventory inv = Inventory.builder()
                .productId(productId)
                .sku(sku != null ? sku : "SKU-" + productId.substring(0, Math.min(productId.length(), 8)))
                .availableQuantity(quantity)
                .reservedQuantity(0)
                .totalQuantity(quantity)
                .build();
        return inventoryRepository.save(inv);
    }

    private void saveOutboxEvent(String aggregateId, String eventType, Object payload) {
        try {
            BaseEvent<Object> event = BaseEvent.builder()
                    .eventType(eventType)
                    .aggregateId(aggregateId)
                    .payload(payload)
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("INVENTORY")
                    .aggregateId(aggregateId)
                    .eventType(eventType)
                    .topic(KafkaTopics.INVENTORY_EVENTS)
                    .payload(objectMapper.writeValueAsString(event))
                    .status(OutboxStatus.PENDING)
                    .build();

            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            log.error("Failed to write inventory outbox event [{}]: {}", eventType, e.getMessage());
        }
    }

    private InventoryResponse toResponse(Inventory inv) {
        return InventoryResponse.builder()
                .id(inv.getId())
                .productId(inv.getProductId())
                .sku(inv.getSku())
                .availableQuantity(inv.getAvailableQuantity())
                .reservedQuantity(inv.getReservedQuantity())
                .totalQuantity(inv.getTotalQuantity())
                .inStock(inv.getAvailableQuantity() > 0)
                .updatedAt(inv.getUpdatedAt())
                .build();
    }
}
