package com.shopsphere.analytics.repository;

import com.shopsphere.analytics.entity.OrderMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderMetricRepository extends JpaRepository<OrderMetric, UUID> {
    Optional<OrderMetric> findByOrderId(String orderId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM OrderMetric o WHERE o.status != 'CANCELLED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COUNT(DISTINCT o.customerId) FROM OrderMetric o")
    long countUniqueCustomers();

    @Query("SELECT o.paymentMethod, COUNT(o) FROM OrderMetric o GROUP BY o.paymentMethod")
    List<Object[]> countByPaymentMethod();
}
