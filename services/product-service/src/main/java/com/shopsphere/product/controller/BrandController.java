package com.shopsphere.product.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.product.dto.BrandDto;
import com.shopsphere.product.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandDto>>> getAllBrands() {
        List<BrandDto> brands = brandService.getAllBrands();
        return ResponseEntity.ok(ApiResponse.success(brands));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandDto>> getById(@PathVariable UUID id) {
        BrandDto brand = brandService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(brand));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BrandDto>> createBrand(@Valid @RequestBody BrandDto dto) {
        BrandDto created = brandService.createBrand(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Brand created successfully", created));
    }
}
