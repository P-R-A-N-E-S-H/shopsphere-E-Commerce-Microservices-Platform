package com.shopsphere.review.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.review.dto.CreateReviewRequest;
import com.shopsphere.review.dto.ProductReviewSummary;
import com.shopsphere.review.dto.ReviewResponse;
import com.shopsphere.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<ProductReviewSummary>> getProductReviews(
            @PathVariable String productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ProductReviewSummary summary = reviewService.getProductReviews(productId, page, size);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse created = reviewService.createReview(userId, userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", created));
    }

    @PostMapping("/{id}/helpful")
    public ResponseEntity<ApiResponse<ReviewResponse>> voteHelpful(@PathVariable UUID id) {
        ReviewResponse response = reviewService.voteHelpful(id);
        return ResponseEntity.ok(ApiResponse.success("Marked review as helpful", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
