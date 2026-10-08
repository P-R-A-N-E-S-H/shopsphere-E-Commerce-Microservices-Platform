package com.shopsphere.search.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.common.dto.PageResponse;
import com.shopsphere.search.dto.FacetsResponse;
import com.shopsphere.search.entity.SearchProduct;
import com.shopsphere.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<SearchProduct>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        PageResponse<SearchProduct> results = searchService.search(
                q, categoryId, brand, minPrice, maxPrice, minRating, page, size, sortBy, sortDirection
        );
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSuggestions(@RequestParam String q) {
        List<String> suggestions = searchService.getSuggestions(q);
        return ResponseEntity.ok(ApiResponse.success(suggestions));
    }

    @GetMapping("/facets")
    public ResponseEntity<ApiResponse<FacetsResponse>> getFacets() {
        FacetsResponse facets = searchService.getFacets();
        return ResponseEntity.ok(ApiResponse.success(facets));
    }
}
