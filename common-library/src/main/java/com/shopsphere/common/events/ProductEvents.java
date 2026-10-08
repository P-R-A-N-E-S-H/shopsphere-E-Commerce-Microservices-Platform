package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class ProductEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductCreatedPayload {
        private String productId;
        private String sku;
        private String name;
        private String slug;
        private String description;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private String categoryId;
        private String categoryName;
        private String brand;
        private List<String> images;
        private String sellerId;
        private int initialStock;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductUpdatedPayload {
        private String productId;
        private String sku;
        private String name;
        private String slug;
        private String description;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private String categoryId;
        private String brand;
        private List<String> images;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductDeletedPayload {
        private String productId;
        private String sku;
    }
}
