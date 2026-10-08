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
public class BrandDto implements Serializable {
    private UUID id;

    @NotBlank(message = "Brand name is required")
    private String name;

    private String slug;
    private String logoUrl;
    private String description;
}
