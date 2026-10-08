package com.shopsphere.review.service;

import com.shopsphere.common.dto.PageResponse;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.review.dto.CreateReviewRequest;
import com.shopsphere.review.dto.ProductReviewSummary;
import com.shopsphere.review.dto.ReviewResponse;
import com.shopsphere.review.entity.Review;
import com.shopsphere.review.repository.ReviewRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @PostConstruct
    @Transactional
    public void seedReviews() {
        if (reviewRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial reviews...");
        reviewRepository.save(Review.builder()
                .productId("SKU-APPL-MBP-16")
                .userId(UUID.randomUUID().toString())
                .userName("Alex Johnson")
                .userAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100")
                .rating(5)
                .title("Absolute powerhouse of a machine!")
                .comment("The M3 Max chip effortlessly handles 4K multi-cam editing and Docker containers without breaking a sweat. The battery lasts through full work days.")
                .verifiedPurchase(true)
                .helpfulVotes(34)
                .build());

        reviewRepository.save(Review.builder()
                .productId("SKU-SNY-WH1000XM5")
                .userId(UUID.randomUUID().toString())
                .userName("Sarah Miller")
                .userAvatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100")
                .rating(5)
                .title("Best noise cancellation on the market")
                .comment("I travel frequently for work and these make flights silent. The soundstage is rich and the mic quality is top notch.")
                .verifiedPurchase(true)
                .helpfulVotes(28)
                .build());

        reviewRepository.save(Review.builder()
                .productId("SKU-NIKE-AF1-07")
                .userId(UUID.randomUUID().toString())
                .userName("Michael Chen")
                .userAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100")
                .rating(5)
                .title("Timeless classic sneaker")
                .comment("Incredibly comfortable and versatile. Fits true to size with premium leather finish.")
                .verifiedPurchase(true)
                .helpfulVotes(19)
                .build());
    }

    @Transactional(readOnly = true)
    public ProductReviewSummary getProductReviews(String productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);

        List<Review> allReviews = reviewRepository.findByProductId(productId);
        double avgRating = allReviews.isEmpty() ? 0.0 : allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        long totalReviews = allReviews.size();

        Map<Integer, Long> breakdown = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            int ratingVal = i;
            breakdown.put(ratingVal, allReviews.stream().filter(r -> r.getRating() == ratingVal).count());
        }

        List<ReviewResponse> content = reviewPage.getContent().stream().map(this::toResponse).collect(Collectors.toList());

        PageResponse<ReviewResponse> pagedReviews = PageResponse.<ReviewResponse>builder()
                .content(content)
                .pageNumber(reviewPage.getNumber())
                .pageSize(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .isFirst(reviewPage.isFirst())
                .isLast(reviewPage.isLast())
                .build();

        return ProductReviewSummary.builder()
                .productId(productId)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .totalReviews(totalReviews)
                .ratingBreakdown(breakdown)
                .reviews(pagedReviews)
                .build();
    }

    @Transactional
    public ReviewResponse createReview(String userId, String userEmail, CreateReviewRequest request) {
        String name = request.getUserName() != null && !request.getUserName().isBlank()
                ? request.getUserName()
                : (userEmail != null ? userEmail.split("@")[0] : "Verified Customer");

        Review review = Review.builder()
                .productId(request.getProductId())
                .userId(userId != null ? userId : UUID.randomUUID().toString())
                .userName(name)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .verifiedPurchase(true)
                .helpfulVotes(0)
                .build();

        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse voteHelpful(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId.toString()));

        review.setHelpfulVotes(review.getHelpfulVotes() + 1);
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(UUID reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .productId(r.getProductId())
                .userId(r.getUserId())
                .userName(r.getUserName())
                .userAvatar(r.getUserAvatar())
                .rating(r.getRating())
                .title(r.getTitle())
                .comment(r.getComment())
                .verifiedPurchase(r.isVerifiedPurchase())
                .helpfulVotes(r.getHelpfulVotes())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
