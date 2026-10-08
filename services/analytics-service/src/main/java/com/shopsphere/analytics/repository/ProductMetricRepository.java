package com.shopsphere.analytics.repository;

import com.shopsphere.analytics.entity.ProductMetric;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductMetricRepository extends JpaRepository<ProductMetric, UUID> {
    Optional<ProductMetric> findByProductId(String productId);

    @Query("SELECT p FROM ProductMetric p ORDER BY p.totalRevenue DESC")
    List<ProductMetric> findTopByRevenue(Pageable pageable);

    @Query("SELECT p.categoryName, SUM(p.totalRevenue) FROM ProductMetric p WHERE p.categoryName IS NOT NULL GROUP BY p.categoryName")
    List<Object[]> revenueByCategory();
}
