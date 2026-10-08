package com.shopsphere.inventory.dto;

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
public class InventoryResponse {
    private UUID id;
    private String productId;
    private String sku;
    private int availableQuantity;
    private int reservedQuantity;
    private int totalQuantity;
    private boolean inStock;
    private Instant updatedAt;
}
