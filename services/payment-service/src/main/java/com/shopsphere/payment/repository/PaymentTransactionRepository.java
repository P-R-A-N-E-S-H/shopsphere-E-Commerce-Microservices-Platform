package com.shopsphere.payment.repository;

import com.shopsphere.payment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {
    Optional<PaymentTransaction> findByPaymentId(String paymentId);
    Optional<PaymentTransaction> findByIdempotencyKey(String idempotencyKey);
    List<PaymentTransaction> findByOrderId(String orderId);
}
