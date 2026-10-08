package com.shopsphere.review.dto;

import com.shopsphere.common.dto.PageResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewSummary {
    private String productId;
    private double averageRating;
    private long totalReviews;
    private Map<Integer, Long> ratingBreakdown;
    private PageResponse<ReviewResponse> reviews;
}
