package com.shopsphere.cart.controller;

import com.shopsphere.cart.dto.AddToCartRequest;
import com.shopsphere.cart.dto.ApplyCouponRequest;
import com.shopsphere.cart.dto.UpdateQuantityRequest;
import com.shopsphere.cart.model.Cart;
import com.shopsphere.cart.service.CartService;
import com.shopsphere.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<Cart>> getCart(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        String key = resolveKey(userId, sessionId);
        Cart cart = cartService.getCart(key);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<Cart>> addItem(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @Valid @RequestBody AddToCartRequest request) {
        String key = resolveKey(userId, sessionId);
        Cart cart = cartService.addItem(key, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<Cart>> updateQuantity(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable String productId,
            @Valid @RequestBody UpdateQuantityRequest request) {
        String key = resolveKey(userId, sessionId);
        Cart cart = cartService.updateItemQuantity(key, productId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<Cart>> removeItem(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable String productId) {
        String key = resolveKey(userId, sessionId);
        Cart cart = cartService.removeItem(key, productId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        String key = resolveKey(userId, sessionId);
        cartService.clearCart(key);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }

    @PostMapping("/coupon")
    public ResponseEntity<ApiResponse<Cart>> applyCoupon(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @Valid @RequestBody ApplyCouponRequest request) {
        String key = resolveKey(userId, sessionId);
        double discountPercent = 10.0; // Standard 10% or from coupon code
        String code = request.getCouponCode().toUpperCase();
        if (code.contains("20")) {
            discountPercent = 20.0;
        } else if (code.contains("50")) {
            discountPercent = 25.0;
        } else if (code.contains("15")) {
            discountPercent = 15.0;
        }
        Cart cart = cartService.applyCoupon(key, request.getCouponCode(), discountPercent);
        return ResponseEntity.ok(ApiResponse.success("Coupon applied successfully", cart));
    }

    @DeleteMapping("/coupon")
    public ResponseEntity<ApiResponse<Cart>> removeCoupon(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        String key = resolveKey(userId, sessionId);
        Cart cart = cartService.removeCoupon(key);
        return ResponseEntity.ok(ApiResponse.success("Coupon removed", cart));
    }

    @PostMapping("/merge")
    public ResponseEntity<ApiResponse<Cart>> mergeCart(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String guestId) {
        Cart cart = cartService.mergeCarts(guestId, userId);
        return ResponseEntity.ok(ApiResponse.success("Cart merged successfully", cart));
    }

    private String resolveKey(String userId, String sessionId) {
        if (userId != null && !userId.isBlank()) {
            return userId;
        }
        if (sessionId != null && !sessionId.isBlank()) {
            return sessionId;
        }
        return "anonymous-guest";
    }
}
