package com.shopsphere.user.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.user.dto.UpdateProfileRequest;
import com.shopsphere.user.entity.UserProfile;
import com.shopsphere.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfile>> getProfile(@RequestHeader("X-User-Id") String userId) {
        UserProfile profile = userService.getProfile(UUID.fromString(userId));
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfile>> updateProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfile profile = userService.updateProfile(UUID.fromString(userId), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfile>> getUserById(@PathVariable UUID id) {
        UserProfile profile = userService.getProfile(id);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
