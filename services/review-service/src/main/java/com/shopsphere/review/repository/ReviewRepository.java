package com.shopsphere.review.repository;

import com.shopsphere.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    Page<Review> findByProductIdOrderByCreatedAtDesc(String productId, Pageable pageable);
    List<Review> findByProductId(String productId);
    long countByProductId(String productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId")
    Double getAverageRating(String productId);
}
