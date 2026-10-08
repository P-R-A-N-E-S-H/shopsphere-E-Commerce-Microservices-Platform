package com.shopsphere.product.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.dto.PageResponse;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.ProductEvents;
import com.shopsphere.common.exception.ConflictException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.common.outbox.OutboxEvent;
import com.shopsphere.common.outbox.OutboxEventRepository;
import com.shopsphere.common.outbox.OutboxStatus;
import com.shopsphere.product.dto.ProductRequest;
import com.shopsphere.product.dto.ProductResponse;
import com.shopsphere.product.entity.Category;
import com.shopsphere.product.entity.Product;
import com.shopsphere.product.repository.CategoryRepository;
import com.shopsphere.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getProducts(
            UUID categoryId,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String status,
            String search,
            Boolean featured,
            int page,
            int size,
            String sortBy,
            String sortDirection) {

        Sort sort = Sort.by(
                "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy != null ? sortBy : "createdAt"
        );
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage = productRepository.findWithFilters(
                categoryId,
                brand,
                minPrice,
                maxPrice,
                status != null ? status : "ACTIVE",
                search,
                pageable
        );

        List<ProductResponse> responses = productPage.getContent().stream()
                .filter(p -> featured == null || p.isFeatured() == featured)
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<ProductResponse>builder()
                .content(responses)
                .pageNumber(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .isFirst(productPage.isFirst())
                .isLast(productPage.isLast())
                .build();
    }

    @Cacheable(value = "products", key = "#id")
    @Transactional(readOnly = true)
    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id.toString()));
        return toResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
        return toResponse(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "products", allEntries = true)
    @Transactional
    public ProductResponse createProduct(ProductRequest request, String sellerId) {
        String sku = request.getSku() != null && !request.getSku().isBlank()
                ? request.getSku()
                : "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        if (productRepository.existsBySku(sku)) {
            throw new ConflictException("Product with SKU " + sku + " already exists");
        }

        String baseSlug = request.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        String slug = baseSlug;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        String categoryName = request.getCategoryName();
        if (categoryName == null && request.getCategoryId() != null) {
            categoryName = categoryRepository.findById(request.getCategoryId())
                    .map(Category::getName)
                    .orElse("General");
        }

        Product product = Product.builder()
                .sku(sku)
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .categoryId(request.getCategoryId())
                .categoryName(categoryName)
                .brand(request.getBrand())
                .images(request.getImages() != null ? request.getImages() : List.of())
                .sellerId(sellerId)
                .stock(request.getInitialStock() > 0 ? request.getInitialStock() : 100)
                .featured(request.isFeatured())
                .status("ACTIVE")
                .build();

        product = productRepository.save(product);

        // Transactional Outbox for ProductCreated
        saveOutboxEvent(
                product.getId().toString(),
                "PRODUCT_CREATED",
                ProductEvents.ProductCreatedPayload.builder()
                        .productId(product.getId().toString())
                        .sku(product.getSku())
                        .name(product.getName())
                        .slug(product.getSlug())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .discountPrice(product.getDiscountPrice())
                        .categoryId(product.getCategoryId() != null ? product.getCategoryId().toString() : null)
                        .categoryName(product.getCategoryName())
                        .brand(product.getBrand())
                        .images(product.getImages())
                        .sellerId(product.getSellerId())
                        .initialStock(product.getStock())
                        .build()
        );

        return toResponse(product);
    }

    @CacheEvict(value = "products", key = "#id")
    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id.toString()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        if (request.getCategoryId() != null) {
            product.setCategoryId(request.getCategoryId());
            product.setCategoryName(request.getCategoryName());
        }
        if (request.getBrand() != null) {
            product.setBrand(request.getBrand());
        }
        if (request.getImages() != null) {
            product.setImages(request.getImages());
        }
        product.setFeatured(request.isFeatured());

        product = productRepository.save(product);

        saveOutboxEvent(
                product.getId().toString(),
                "PRODUCT_UPDATED",
                ProductEvents.ProductUpdatedPayload.builder()
                        .productId(product.getId().toString())
                        .sku(product.getSku())
                        .name(product.getName())
                        .slug(product.getSlug())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .discountPrice(product.getDiscountPrice())
                        .categoryId(product.getCategoryId() != null ? product.getCategoryId().toString() : null)
                        .brand(product.getBrand())
                        .images(product.getImages())
                        .status(product.getStatus())
                        .build()
        );

        return toResponse(product);
    }

    @CacheEvict(value = "products", key = "#id")
    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id.toString()));

        productRepository.delete(product);

        saveOutboxEvent(
                id.toString(),
                "PRODUCT_DELETED",
                ProductEvents.ProductDeletedPayload.builder()
                        .productId(id.toString())
                        .sku(product.getSku())
                        .build()
        );
    }

    private void saveOutboxEvent(String aggregateId, String eventType, Object payload) {
        try {
            BaseEvent<Object> event = BaseEvent.builder()
                    .eventType(eventType)
                    .aggregateId(aggregateId)
                    .payload(payload)
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("PRODUCT")
                    .aggregateId(aggregateId)
                    .eventType(eventType)
                    .topic(KafkaTopics.PRODUCT_EVENTS)
                    .payload(objectMapper.writeValueAsString(event))
                    .status(OutboxStatus.PENDING)
                    .build();

            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            log.error("Failed to write product outbox event [{}]: {}", eventType, e.getMessage());
        }
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .sku(p.getSku())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .price(p.getPrice())
                .discountPrice(p.getDiscountPrice())
                .categoryId(p.getCategoryId())
                .categoryName(p.getCategoryName())
                .brand(p.getBrand())
                .images(p.getImages())
                .sellerId(p.getSellerId())
                .stock(p.getStock())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .status(p.getStatus())
                .featured(p.isFeatured())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
