package com.shopsphere.cart.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotBlank(message = "Product ID is required")
    private String productId;

    private String sku;

    @NotBlank(message = "Product name is required")
    private String name;

    private String image;

    @NotNull(message = "Price is required")
    @DecimalMin("0.01")
    private BigDecimal price;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Builder.Default
    private int quantity = 1;
}
