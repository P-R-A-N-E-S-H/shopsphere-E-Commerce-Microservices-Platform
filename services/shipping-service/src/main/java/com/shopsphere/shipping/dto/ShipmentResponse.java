package com.shopsphere.shipping.dto;

import com.shopsphere.common.enums.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {
    private UUID id;
    private String shipmentNumber;
    private String orderId;
    private String customerId;
    private String carrier;
    private String trackingNumber;
    private ShipmentStatus status;
    private Instant estimatedDelivery;
    private Instant shippedAt;
    private Instant deliveredAt;
    private String recipientName;
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String phoneNumber;
    private String currentLocation;
    private String notes;
    private Instant createdAt;
}
