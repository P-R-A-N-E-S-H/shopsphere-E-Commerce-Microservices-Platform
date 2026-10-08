package com.shopsphere.review.dto;

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
public class ReviewResponse {
    private UUID id;
    private String productId;
    private String userId;
    private String userName;
    private String userAvatar;
    private int rating;
    private String title;
    private String comment;
    private boolean verifiedPurchase;
    private int helpfulVotes;
    private Instant createdAt;
}
