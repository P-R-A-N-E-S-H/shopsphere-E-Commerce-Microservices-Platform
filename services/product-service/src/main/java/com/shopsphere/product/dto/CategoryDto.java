package com.shopsphere.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto implements Serializable {
    private UUID id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String slug;
    private String description;
    private String icon;
    private String imageUrl;
    private UUID parentId;
}
