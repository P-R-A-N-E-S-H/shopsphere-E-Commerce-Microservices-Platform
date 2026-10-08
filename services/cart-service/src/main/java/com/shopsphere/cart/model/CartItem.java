package com.shopsphere.cart.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem implements Serializable {
    private String productId;
    private String sku;
    private String name;
    private String image;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;
}
