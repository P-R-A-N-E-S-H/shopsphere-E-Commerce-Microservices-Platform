package com.shopsphere.analytics.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "order_metrics", indexes = {
        @Index(name = "idx_metric_order_id", columnList = "orderId", unique = true),
        @Index(name = "idx_metric_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    private int itemCount;

    private String status;

    private String paymentMethod;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
