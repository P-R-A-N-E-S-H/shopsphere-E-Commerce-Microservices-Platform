package com.shopsphere.product.service;

import com.shopsphere.common.exception.ConflictException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.product.dto.BrandDto;
import com.shopsphere.product.entity.Brand;
import com.shopsphere.product.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    @Cacheable(value = "brands")
    @Transactional(readOnly = true)
    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BrandDto getById(UUID id) {
        return brandRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", id.toString()));
    }

    @CacheEvict(value = "brands", allEntries = true)
    @Transactional
    public BrandDto createBrand(BrandDto dto) {
        String slug = dto.getSlug() != null ? dto.getSlug() : dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        if (brandRepository.existsByName(dto.getName())) {
            throw new ConflictException("Brand already exists");
        }

        Brand brand = Brand.builder()
                .name(dto.getName())
                .slug(slug)
                .logoUrl(dto.getLogoUrl())
                .description(dto.getDescription())
                .build();

        return toDto(brandRepository.save(brand));
    }

    private BrandDto toDto(Brand b) {
        return BrandDto.builder()
                .id(b.getId())
                .name(b.getName())
                .slug(b.getSlug())
                .logoUrl(b.getLogoUrl())
                .description(b.getDescription())
                .build();
    }
}
