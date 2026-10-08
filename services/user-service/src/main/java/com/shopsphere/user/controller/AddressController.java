package com.shopsphere.user.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.user.dto.AddressDto;
import com.shopsphere.user.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(@RequestHeader("X-User-Id") String userId) {
        List<AddressDto> addresses = addressService.getUserAddresses(UUID.fromString(userId));
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody AddressDto dto) {
        AddressDto created = addressService.addAddress(UUID.fromString(userId), dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address added successfully", created));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID addressId,
            @Valid @RequestBody AddressDto dto) {
        AddressDto updated = addressService.updateAddress(UUID.fromString(userId), addressId, dto);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", updated));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID addressId) {
        addressService.deleteAddress(UUID.fromString(userId), addressId);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }

    @PutMapping("/{addressId}/default")
    public ResponseEntity<ApiResponse<Void>> setDefaultShipping(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID addressId) {
        addressService.setDefaultShipping(UUID.fromString(userId), addressId);
        return ResponseEntity.ok(ApiResponse.success("Default shipping address updated", null));
    }
}
