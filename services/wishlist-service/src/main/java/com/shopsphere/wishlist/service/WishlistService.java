package com.shopsphere.wishlist.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.wishlist.model.WishlistItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final Duration WISHLIST_TTL = Duration.ofDays(90);

    public List<WishlistItem> getWishlist(String userId) {
        String key = "wishlist:" + userId;
        String json = redisTemplate.opsForValue().get(key);
        if (json != null) {
            try {
                return objectMapper.readValue(json, new TypeReference<List<WishlistItem>>() {});
            } catch (Exception e) {
                log.error("Failed to parse wishlist from Redis: {}", e.getMessage());
            }
        }
        return new ArrayList<>();
    }

    public List<WishlistItem> addItem(String userId, WishlistItem item) {
        List<WishlistItem> items = getWishlist(userId);
        boolean exists = items.stream().anyMatch(i -> i.getProductId().equals(item.getProductId()));
        if (!exists) {
            items.add(0, item);
            saveWishlist(userId, items);
        }
        return items;
    }

    public List<WishlistItem> removeItem(String userId, String productId) {
        List<WishlistItem> items = getWishlist(userId);
        items.removeIf(i -> i.getProductId().equals(productId));
        saveWishlist(userId, items);
        return items;
    }

    public boolean isInWishlist(String userId, String productId) {
        List<WishlistItem> items = getWishlist(userId);
        return items.stream().anyMatch(i -> i.getProductId().equals(productId));
    }

    public void clearWishlist(String userId) {
        redisTemplate.delete("wishlist:" + userId);
    }

    private void saveWishlist(String userId, List<WishlistItem> items) {
        try {
            String json = objectMapper.writeValueAsString(items);
            redisTemplate.opsForValue().set("wishlist:" + userId, json, WISHLIST_TTL);
        } catch (Exception e) {
            log.error("Failed to save wishlist to Redis: {}", e.getMessage());
        }
    }
}
