package com.shopsphere.order.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.common.dto.PageResponse;
import com.shopsphere.common.enums.OrderStatus;
import com.shopsphere.order.dto.CreateOrderRequest;
import com.shopsphere.order.dto.OrderResponse;
import com.shopsphere.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse order = orderService.createOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getUserOrders(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<OrderResponse> orders = orderService.getUserOrders(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable UUID id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id,
            @RequestParam(required = false) String reason) {
        OrderResponse cancelled = orderService.cancelOrder(userId, id, reason);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", cancelled));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) OrderStatus status) {
        PageResponse<OrderResponse> orders = orderService.getAllOrders(page, size, status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }
}
