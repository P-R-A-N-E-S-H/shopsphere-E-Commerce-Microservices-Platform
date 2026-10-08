package com.shopsphere.shipping.entity;

import com.shopsphere.common.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shipments", indexes = {
        @Index(name = "idx_shipment_order_id", columnList = "orderId", unique = true),
        @Index(name = "idx_shipment_tracking", columnList = "trackingNumber", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String shipmentNumber;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Column(nullable = false)
    private String customerId;

    @Builder.Default
    private String carrier = "FedEx Express";

    @Column(nullable = false, unique = true)
    private String trackingNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.CREATED;

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

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
