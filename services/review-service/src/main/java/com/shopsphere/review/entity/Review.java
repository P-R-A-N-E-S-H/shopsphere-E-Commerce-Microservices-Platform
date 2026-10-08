package com.shopsphere.review.entity;

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
@Table(name = "reviews", indexes = {
        @Index(name = "idx_rev_product_id", columnList = "productId"),
        @Index(name = "idx_rev_user_id", columnList = "userId")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private String userId;

    private String userName;

    private String userAvatar;

    @Column(nullable = false)
    private int rating; // 1 - 5

    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    @Builder.Default
    private boolean verifiedPurchase = true;

    @Builder.Default
    private int helpfulVotes = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
