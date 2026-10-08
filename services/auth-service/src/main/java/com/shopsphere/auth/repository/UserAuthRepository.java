package com.shopsphere.auth.repository;

import com.shopsphere.auth.entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, UUID> {
    Optional<UserAuth> findByEmail(String email);
    boolean existsByEmail(String email);
}
