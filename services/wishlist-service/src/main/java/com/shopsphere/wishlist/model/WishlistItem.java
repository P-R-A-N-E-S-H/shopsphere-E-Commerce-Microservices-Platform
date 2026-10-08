package com.shopsphere.wishlist.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItem implements Serializable {
    private String productId;
    private String name;
    private String slug;
    private String sku;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String image;
    private String categoryName;
    private double rating;
    @Builder.Default
    private Instant addedAt = Instant.now();
}
