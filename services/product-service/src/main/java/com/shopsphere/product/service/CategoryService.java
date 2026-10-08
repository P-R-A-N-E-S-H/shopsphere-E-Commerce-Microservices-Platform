package com.shopsphere.product.service;

import com.shopsphere.common.exception.ConflictException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.product.dto.CategoryDto;
import com.shopsphere.product.entity.Category;
import com.shopsphere.product.repository.CategoryRepository;
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
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Cacheable(value = "categories")
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getById(UUID id) {
        return categoryRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id.toString()));
    }

    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        String slug = dto.getSlug() != null ? dto.getSlug() : dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        if (categoryRepository.existsBySlug(slug)) {
            throw new ConflictException("Category slug already exists");
        }

        Category category = Category.builder()
                .name(dto.getName())
                .slug(slug)
                .description(dto.getDescription())
                .icon(dto.getIcon())
                .imageUrl(dto.getImageUrl())
                .parentId(dto.getParentId())
                .build();

        return toDto(categoryRepository.save(category));
    }

    private CategoryDto toDto(Category c) {
        return CategoryDto.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .icon(c.getIcon())
                .imageUrl(c.getImageUrl())
                .parentId(c.getParentId())
                .build();
    }
}
