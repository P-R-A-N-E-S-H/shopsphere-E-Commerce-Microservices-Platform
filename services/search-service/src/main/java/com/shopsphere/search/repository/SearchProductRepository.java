package com.shopsphere.search.repository;

import com.shopsphere.search.entity.SearchProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface SearchProductRepository extends JpaRepository<SearchProduct, UUID> {

    @Query("SELECT p FROM SearchProduct p WHERE " +
            "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.categoryName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:categoryId IS NULL OR p.categoryId = :categoryId) AND " +
            "(:brand IS NULL OR LOWER(p.brand) = LOWER(:brand)) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:minRating IS NULL OR p.rating >= :minRating) AND " +
            "p.status = 'ACTIVE'")
    Page<SearchProduct> searchProducts(
            @Param("query") String query,
            @Param("categoryId") UUID categoryId,
            @Param("brand") String brand,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") Double minRating,
            Pageable pageable
    );

    @Query("SELECT DISTINCT p.name FROM SearchProduct p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) AND p.status = 'ACTIVE'")
    List<String> findSuggestions(@Param("query") String query, Pageable pageable);

    @Query("SELECT p.categoryName, COUNT(p) FROM SearchProduct p WHERE p.status = 'ACTIVE' GROUP BY p.categoryName")
    List<Object[]> countByCategory();

    @Query("SELECT p.brand, COUNT(p) FROM SearchProduct p WHERE p.status = 'ACTIVE' AND p.brand IS NOT NULL GROUP BY p.brand")
    List<Object[]> countByBrand();
}
