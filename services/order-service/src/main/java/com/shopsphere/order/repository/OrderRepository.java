package com.shopsphere.order.repository;

import com.shopsphere.common.enums.OrderStatus;
import com.shopsphere.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findByCustomerIdOrderByCreatedAtDesc(String customerId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);
}
