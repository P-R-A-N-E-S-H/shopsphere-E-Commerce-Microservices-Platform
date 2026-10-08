package com.shopsphere.inventory.repository;

import com.shopsphere.inventory.entity.StockReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockReservationRepository extends JpaRepository<StockReservation, UUID> {
    List<StockReservation> findByOrderId(String orderId);
    List<StockReservation> findByOrderIdAndStatus(String orderId, String status);
}
