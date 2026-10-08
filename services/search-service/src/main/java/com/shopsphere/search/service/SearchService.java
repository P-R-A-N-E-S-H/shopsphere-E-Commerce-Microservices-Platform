package com.shopsphere.search.service;

import com.shopsphere.common.dto.PageResponse;
import com.shopsphere.search.dto.FacetsResponse;
import com.shopsphere.search.entity.SearchProduct;
import com.shopsphere.search.repository.SearchProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchProductRepository searchProductRepository;

    @Transactional(readOnly = true)
    public PageResponse<SearchProduct> search(
            String query,
            UUID categoryId,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            int page,
            int size,
            String sortBy,
            String sortDirection) {

        Sort sort = Sort.by(
                "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy != null ? sortBy : "rating"
        );
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<SearchProduct> resultPage = searchProductRepository.searchProducts(
                (query != null && !query.isBlank()) ? query.trim() : null,
                categoryId,
                brand,
                minPrice,
                maxPrice,
                minRating,
                pageable
        );

        return PageResponse.<SearchProduct>builder()
                .content(resultPage.getContent())
                .pageNumber(resultPage.getNumber())
                .pageSize(resultPage.getSize())
                .totalElements(resultPage.getTotalElements())
                .totalPages(resultPage.getTotalPages())
                .isFirst(resultPage.isFirst())
                .isLast(resultPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public List<String> getSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
            return Collections.emptyList();
        }
        return searchProductRepository.findSuggestions(query.trim(), PageRequest.of(0, 8));
    }

    @Transactional(readOnly = true)
    public FacetsResponse getFacets() {
        Map<String, Long> categoryFacets = new LinkedHashMap<>();
        for (Object[] row : searchProductRepository.countByCategory()) {
            if (row[0] != null) {
                categoryFacets.put((String) row[0], (Long) row[1]);
            }
        }

        Map<String, Long> brandFacets = new LinkedHashMap<>();
        for (Object[] row : searchProductRepository.countByBrand()) {
            if (row[0] != null) {
                brandFacets.put((String) row[0], (Long) row[1]);
            }
        }

        return FacetsResponse.builder()
                .categories(categoryFacets)
                .brands(brandFacets)
                .build();
    }

    @Transactional
    public void indexProduct(SearchProduct product) {
        searchProductRepository.save(product);
        log.info("Indexed product in search service: {} [{}]", product.getName(), product.getId());
    }

    @Transactional
    public void deleteProduct(UUID productId) {
        searchProductRepository.deleteById(productId);
        log.info("Deleted product from search index: {}", productId);
    }
}
