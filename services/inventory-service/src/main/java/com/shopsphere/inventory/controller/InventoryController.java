package com.shopsphere.inventory.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.inventory.dto.InventoryResponse;
import com.shopsphere.inventory.dto.ReservationRequest;
import com.shopsphere.inventory.dto.RestockRequest;
import com.shopsphere.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventory(@PathVariable String productId) {
        InventoryResponse response = inventoryService.getInventory(productId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/reserve")
    public ResponseEntity<ApiResponse<Boolean>> reserve(@Valid @RequestBody ReservationRequest request) {
        boolean success = inventoryService.reserveStock(request.getOrderId(), request.getItems());
        return ResponseEntity.ok(ApiResponse.success(success));
    }

    @PostMapping("/restock")
    public ResponseEntity<ApiResponse<InventoryResponse>> restock(@Valid @RequestBody RestockRequest request) {
        InventoryResponse response = inventoryService.restock(request);
        return ResponseEntity.ok(ApiResponse.success("Stock updated", response));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getLowStock(@RequestParam(defaultValue = "10") int threshold) {
        List<InventoryResponse> list = inventoryService.getLowStock(threshold);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
