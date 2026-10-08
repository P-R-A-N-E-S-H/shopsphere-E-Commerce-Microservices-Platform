package com.shopsphere.notification.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.notification.model.Notification;
import com.shopsphere.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Notification>>> getUserNotifications(@PathVariable String userId) {
        List<Notification> list = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id) {
        notificationService.markAsRead(userId != null ? userId : "all", id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<Notification>>> getRecentLogs() {
        List<Notification> logs = notificationService.getRecentLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
