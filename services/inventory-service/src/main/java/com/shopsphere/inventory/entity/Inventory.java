package com.shopsphere.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inventories", indexes = {
        @Index(name = "idx_inv_product_id", columnList = "productId", unique = true),
        @Index(name = "idx_inv_sku", columnList = "sku")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String productId;

    private String sku;

    @Column(nullable = false)
    @Builder.Default
    private int availableQuantity = 0;

    @Column(nullable = false)
    @Builder.Default
    private int reservedQuantity = 0;

    @Column(nullable = false)
    @Builder.Default
    private int totalQuantity = 0;

    @Version
    private Long version;

    @UpdateTimestamp
    private Instant updatedAt;
}
