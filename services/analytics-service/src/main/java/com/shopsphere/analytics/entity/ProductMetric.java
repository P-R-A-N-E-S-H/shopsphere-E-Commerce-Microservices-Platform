package com.shopsphere.analytics.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product_metrics", indexes = {
        @Index(name = "idx_pmetric_prod_id", columnList = "productId", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String productId;

    private String productName;

    private String categoryName;

    @Builder.Default
    private long unitsSold = 0;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalRevenue = BigDecimal.ZERO;
}
