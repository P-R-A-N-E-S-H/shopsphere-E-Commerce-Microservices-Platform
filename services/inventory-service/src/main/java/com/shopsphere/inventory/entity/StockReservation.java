package com.shopsphere.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "stock_reservations", indexes = {
        @Index(name = "idx_res_order_id", columnList = "orderId"),
        @Index(name = "idx_res_product_id", columnList = "productId")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String orderId;

    @Column(nullable = false)
    private String reservationId;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    @Builder.Default
    private String status = "RESERVED"; // RESERVED, RELEASED, FULFILLED

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant expiresAt;
}
