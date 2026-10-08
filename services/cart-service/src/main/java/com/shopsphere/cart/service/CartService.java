package com.shopsphere.cart.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.cart.dto.AddToCartRequest;
import com.shopsphere.cart.dto.UpdateQuantityRequest;
import com.shopsphere.cart.model.Cart;
import com.shopsphere.cart.model.CartItem;
import com.shopsphere.common.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final Duration CART_TTL = Duration.ofDays(30);

    public Cart getCart(String cartKey) {
        String key = buildKey(cartKey);
        String json = redisTemplate.opsForValue().get(key);
        if (json != null) {
            try {
                Cart cart = objectMapper.readValue(json, Cart.class);
                cart.recalculate();
                return cart;
            } catch (Exception e) {
                log.error("Failed to parse cart from Redis: {}", e.getMessage());
            }
        }
        Cart newCart = Cart.builder().cartId(cartKey).userId(cartKey).items(new ArrayList<>()).build();
        newCart.recalculate();
        saveCart(key, newCart);
        return newCart;
    }

    public Cart addItem(String cartKey, AddToCartRequest request) {
        Cart cart = getCart(cartKey);
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .productId(request.getProductId())
                    .sku(request.getSku())
                    .name(request.getName())
                    .image(request.getImage())
                    .price(request.getPrice())
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        cart.recalculate();
        saveCart(buildKey(cartKey), cart);
        return cart;
    }

    public Cart updateItemQuantity(String cartKey, String productId, UpdateQuantityRequest request) {
        Cart cart = getCart(cartKey);
        if (request.getQuantity() <= 0) {
            cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        } else {
            cart.getItems().stream()
                    .filter(i -> i.getProductId().equals(productId))
                    .findFirst()
                    .ifPresent(item -> item.setQuantity(request.getQuantity()));
        }

        cart.recalculate();
        saveCart(buildKey(cartKey), cart);
        return cart;
    }

    public Cart removeItem(String cartKey, String productId) {
        Cart cart = getCart(cartKey);
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        cart.recalculate();
        saveCart(buildKey(cartKey), cart);
        return cart;
    }

    public void clearCart(String cartKey) {
        redisTemplate.delete(buildKey(cartKey));
    }

    public Cart applyCoupon(String cartKey, String couponCode, double discountPercentage) {
        Cart cart = getCart(cartKey);
        cart.setCouponCode(couponCode.toUpperCase());
        cart.setDiscountPercentage(discountPercentage);
        cart.recalculate();
        saveCart(buildKey(cartKey), cart);
        return cart;
    }

    public Cart removeCoupon(String cartKey) {
        Cart cart = getCart(cartKey);
        cart.setCouponCode(null);
        cart.setDiscountPercentage(0.0);
        cart.recalculate();
        saveCart(buildKey(cartKey), cart);
        return cart;
    }

    public Cart mergeCarts(String guestKey, String userKey) {
        Cart guestCart = getCart(guestKey);
        Cart userCart = getCart(userKey);

        for (CartItem guestItem : guestCart.getItems()) {
            Optional<CartItem> userItem = userCart.getItems().stream()
                    .filter(i -> i.getProductId().equals(guestItem.getProductId()))
                    .findFirst();

            if (userItem.isPresent()) {
                userItem.get().setQuantity(userItem.get().getQuantity() + guestItem.getQuantity());
            } else {
                userCart.getItems().add(guestItem);
            }
        }

        userCart.recalculate();
        saveCart(buildKey(userKey), userCart);
        clearCart(guestKey);
        return userCart;
    }

    private void saveCart(String key, Cart cart) {
        try {
            String json = objectMapper.writeValueAsString(cart);
            redisTemplate.opsForValue().set(key, json, CART_TTL);
        } catch (Exception e) {
            log.error("Failed to save cart to Redis: {}", e.getMessage());
        }
    }

    private String buildKey(String cartKey) {
        return "cart:" + cartKey;
    }
}
