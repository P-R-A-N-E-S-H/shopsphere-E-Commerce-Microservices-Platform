package com.shopsphere.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse implements Serializable {
    private UUID id;
    private String sku;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private UUID categoryId;
    private String categoryName;
    private String brand;
    private List<String> images;
    private String sellerId;
    private int stock;
    private double rating;
    private int reviewCount;
    private String status;
    private boolean featured;
    private Instant createdAt;
    private Instant updatedAt;
}
