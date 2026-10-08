package com.shopsphere.coupon.repository;

import com.shopsphere.coupon.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {
    Optional<Coupon> findByCodeIgnoreCase(String code);
    List<Coupon> findByActiveTrue();
    boolean existsByCodeIgnoreCase(String code);
}
