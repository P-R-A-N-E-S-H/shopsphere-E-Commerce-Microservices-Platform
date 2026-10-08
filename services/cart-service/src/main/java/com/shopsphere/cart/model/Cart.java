package com.shopsphere.cart.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart implements Serializable {
    private String cartId;
    private String userId;

    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal tax = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;

    private String couponCode;
    private double discountPercentage;

    public void recalculate() {
        BigDecimal calculatedSubtotal = BigDecimal.ZERO;
        for (CartItem item : items) {
            BigDecimal itemSubtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            item.setSubtotal(itemSubtotal);
            calculatedSubtotal = calculatedSubtotal.add(itemSubtotal);
        }
        this.subtotal = calculatedSubtotal;

        // Discount
        if (discountPercentage > 0) {
            this.discount = this.subtotal.multiply(BigDecimal.valueOf(discountPercentage / 100.0));
        } else {
            this.discount = BigDecimal.ZERO;
        }

        BigDecimal discountedSubtotal = this.subtotal.subtract(this.discount);
        if (discountedSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            discountedSubtotal = BigDecimal.ZERO;
        }

        // Tax 8%
        this.tax = discountedSubtotal.multiply(BigDecimal.valueOf(0.08));

        // Shipping: free over $100, otherwise $15 (or 0 if cart is empty)
        if (items.isEmpty()) {
            this.shippingFee = BigDecimal.ZERO;
            this.tax = BigDecimal.ZERO;
            this.total = BigDecimal.ZERO;
        } else if (discountedSubtotal.compareTo(BigDecimal.valueOf(100)) >= 0) {
            this.shippingFee = BigDecimal.ZERO;
            this.total = discountedSubtotal.add(this.tax);
        } else {
            this.shippingFee = BigDecimal.valueOf(15.00);
            this.total = discountedSubtotal.add(this.tax).add(this.shippingFee);
        }
    }
}
