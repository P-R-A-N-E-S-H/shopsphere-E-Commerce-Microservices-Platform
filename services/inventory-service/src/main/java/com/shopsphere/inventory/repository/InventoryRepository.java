package com.shopsphere.inventory.repository;

import com.shopsphere.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    Optional<Inventory> findByProductId(String productId);
    Optional<Inventory> findBySku(String sku);

    @Query("SELECT i FROM Inventory i WHERE i.availableQuantity <= :threshold")
    List<Inventory> findLowStock(int threshold);
}
