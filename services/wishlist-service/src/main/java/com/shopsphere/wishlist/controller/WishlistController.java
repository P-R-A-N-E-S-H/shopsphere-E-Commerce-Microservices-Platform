package com.shopsphere.wishlist.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.wishlist.model.WishlistItem;
import com.shopsphere.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistItem>>> getWishlist(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        String key = resolveKey(userId, sessionId);
        List<WishlistItem> items = wishlistService.getWishlist(key);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<List<WishlistItem>>> addItem(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @RequestBody WishlistItem item) {
        String key = resolveKey(userId, sessionId);
        List<WishlistItem> items = wishlistService.addItem(key, item);
        return ResponseEntity.ok(ApiResponse.success("Item added to wishlist", items));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<List<WishlistItem>>> removeItem(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable String productId) {
        String key = resolveKey(userId, sessionId);
        List<WishlistItem> items = wishlistService.removeItem(key, productId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from wishlist", items));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkWishlist(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable String productId) {
        String key = resolveKey(userId, sessionId);
        boolean inWishlist = wishlistService.isInWishlist(key, productId);
        return ResponseEntity.ok(ApiResponse.success(inWishlist));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearWishlist(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        String key = resolveKey(userId, sessionId);
        wishlistService.clearWishlist(key);
        return ResponseEntity.ok(ApiResponse.success("Wishlist cleared", null));
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
