package com.shopsphere.shipping.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.shipping.dto.ShipmentResponse;
import com.shopsphere.shipping.dto.UpdateShipmentStatusRequest;
import com.shopsphere.shipping.service.ShippingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<ShipmentResponse>> getShipmentByOrderId(@PathVariable String orderId) {
        ShipmentResponse response = shippingService.getShipmentByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<ApiResponse<ShipmentResponse>> track(@PathVariable String trackingNumber) {
        ShipmentResponse response = shippingService.getShipmentByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ShipmentResponse>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateShipmentStatusRequest request) {
        ShipmentResponse response = shippingService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Shipment status updated", response));
    }

    @PostMapping("/calculate-rate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateRate(@RequestBody Map<String, Object> request) {
        Map<String, Object> rates = Map.of(
                "standard", Map.of("carrier", "USPS Ground", "rate", new BigDecimal("7.99"), "estimatedDays", 5),
                "express", Map.of("carrier", "FedEx Express", "rate", new BigDecimal("15.00"), "estimatedDays", 2),
                "priority", Map.of("carrier", "UPS Next Day Air", "rate", new BigDecimal("29.99"), "estimatedDays", 1)
        );
        return ResponseEntity.ok(ApiResponse.success(rates));
    }
}
