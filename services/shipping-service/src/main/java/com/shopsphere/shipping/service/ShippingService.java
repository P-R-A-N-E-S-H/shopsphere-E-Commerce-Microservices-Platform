package com.shopsphere.shipping.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.enums.ShipmentStatus;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.OrderEvents;
import com.shopsphere.common.events.ShippingEvents;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.common.outbox.OutboxEvent;
import com.shopsphere.common.outbox.OutboxEventRepository;
import com.shopsphere.common.outbox.OutboxStatus;
import com.shopsphere.shipping.dto.ShipmentResponse;
import com.shopsphere.shipping.dto.UpdateShipmentStatusRequest;
import com.shopsphere.shipping.entity.Shipment;
import com.shopsphere.shipping.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShippingService {

    private final ShipmentRepository shipmentRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public Shipment createShipmentForOrder(
            String orderId,
            String customerId,
            OrderEvents.ShippingAddressPayload address) {

        Optional<Shipment> existing = shipmentRepository.findByOrderId(orderId);
        if (existing.isPresent()) {
            return existing.get();
        }

        String trackingNumber = "TRK-" + (10000000 + new Random().nextInt(90000000));
        String shipmentNumber = "SHP-" + (100000 + new Random().nextInt(900000));

        Shipment shipment = Shipment.builder()
                .shipmentNumber(shipmentNumber)
                .orderId(orderId)
                .customerId(customerId)
                .carrier("FedEx Express")
                .trackingNumber(trackingNumber)
                .status(ShipmentStatus.CREATED)
                .estimatedDelivery(Instant.now().plus(3, ChronoUnit.DAYS))
                .street(address != null ? address.getStreet() : "123 Main St")
                .city(address != null ? address.getCity() : "San Francisco")
                .state(address != null ? address.getState() : "CA")
                .postalCode(address != null ? address.getPostalCode() : "94105")
                .country(address != null ? address.getCountry() : "USA")
                .phoneNumber(address != null ? address.getPhoneNumber() : null)
                .currentLocation("Fulfillment Center, Reno NV")
                .build();

        shipment = shipmentRepository.save(shipment);

        saveOutboxEvent(
                orderId,
                "SHIPPING_CREATED",
                ShippingEvents.ShippingCreatedPayload.builder()
                        .shipmentId(shipment.getId().toString())
                        .orderId(orderId)
                        .customerId(customerId)
                        .carrier(shipment.getCarrier())
                        .trackingNumber(shipment.getTrackingNumber())
                        .status(shipment.getStatus().name())
                        .estimatedDelivery(shipment.getEstimatedDelivery())
                        .address(address)
                        .build()
        );

        log.info("Created shipment: {} for order: {}", shipmentNumber, orderId);
        return shipment;
    }

    @Transactional(readOnly = true)
    public ShipmentResponse getShipmentByOrderId(String orderId) {
        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", "orderId", orderId));
        return toResponse(shipment);
    }

    @Transactional(readOnly = true)
    public ShipmentResponse getShipmentByTrackingNumber(String trackingNumber) {
        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", "trackingNumber", trackingNumber));
        return toResponse(shipment);
    }

    @Transactional
    public ShipmentResponse updateStatus(UUID shipmentId, UpdateShipmentStatusRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", "id", shipmentId.toString()));

        shipment.setStatus(request.getStatus());
        if (request.getCurrentLocation() != null) {
            shipment.setCurrentLocation(request.getCurrentLocation());
        }
        if (request.getNotes() != null) {
            shipment.setNotes(request.getNotes());
        }
        if (request.getStatus() == ShipmentStatus.SHIPPED && shipment.getShippedAt() == null) {
            shipment.setShippedAt(Instant.now());
        }
        if (request.getStatus() == ShipmentStatus.DELIVERED && shipment.getDeliveredAt() == null) {
            shipment.setDeliveredAt(Instant.now());
        }

        shipment = shipmentRepository.save(shipment);

        saveOutboxEvent(
                shipment.getOrderId(),
                "SHIPPING_UPDATED",
                ShippingEvents.ShippingUpdatedPayload.builder()
                        .shipmentId(shipment.getId().toString())
                        .orderId(shipment.getOrderId())
                        .status(shipment.getStatus().name())
                        .currentLocation(shipment.getCurrentLocation())
                        .trackingNumber(shipment.getTrackingNumber())
                        .note(shipment.getNotes())
                        .build()
        );

        return toResponse(shipment);
    }

    private void saveOutboxEvent(String aggregateId, String eventType, Object payload) {
        try {
            BaseEvent<Object> event = BaseEvent.builder()
                    .eventType(eventType)
                    .aggregateId(aggregateId)
                    .payload(payload)
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("SHIPPING")
                    .aggregateId(aggregateId)
                    .eventType(eventType)
                    .topic(KafkaTopics.SHIPPING_EVENTS)
                    .payload(objectMapper.writeValueAsString(event))
                    .status(OutboxStatus.PENDING)
                    .build();

            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            log.error("Failed to write shipping outbox event [{}]: {}", eventType, e.getMessage());
        }
    }

    private ShipmentResponse toResponse(Shipment s) {
        return ShipmentResponse.builder()
                .id(s.getId())
                .shipmentNumber(s.getShipmentNumber())
                .orderId(s.getOrderId())
                .customerId(s.getCustomerId())
                .carrier(s.getCarrier())
                .trackingNumber(s.getTrackingNumber())
                .status(s.getStatus())
                .estimatedDelivery(s.getEstimatedDelivery())
                .shippedAt(s.getShippedAt())
                .deliveredAt(s.getDeliveredAt())
                .recipientName(s.getRecipientName())
                .street(s.getStreet())
                .city(s.getCity())
                .state(s.getState())
                .postalCode(s.getPostalCode())
                .country(s.getCountry())
                .phoneNumber(s.getPhoneNumber())
                .currentLocation(s.getCurrentLocation())
                .notes(s.getNotes())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
