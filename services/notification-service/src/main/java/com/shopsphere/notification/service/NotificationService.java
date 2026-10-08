package com.shopsphere.notification.service;

import com.shopsphere.notification.model.Notification;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NotificationService {

    private final List<Notification> notificationLog = Collections.synchronizedList(new ArrayList<>());
    private final Map<String, List<Notification>> userNotifications = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        sendNotification(Notification.builder()
                .userId("all")
                .title("Welcome to ShopSphere!")
                .message("Enjoy 10% off your first purchase with coupon WELCOME10")
                .type("PROMO")
                .build());
    }

    public void sendNotification(Notification notification) {
        notificationLog.add(0, notification);
        if (notificationLog.size() > 500) {
            notificationLog.remove(notificationLog.size() - 1);
        }

        String userId = notification.getUserId();
        if (userId != null) {
            userNotifications.computeIfAbsent(userId, k -> Collections.synchronizedList(new ArrayList<>()))
                    .add(0, notification);
        }

        log.info("DISPATCHED NOTIFICATION [{}] to {}: {}", notification.getType(),
                userId != null ? userId : notification.getRecipientEmail(), notification.getTitle());
    }

    public List<Notification> getUserNotifications(String userId) {
        List<Notification> userList = userNotifications.getOrDefault(userId, new ArrayList<>());
        List<Notification> globalList = userNotifications.getOrDefault("all", new ArrayList<>());
        List<Notification> merged = new ArrayList<>(userList);
        merged.addAll(globalList);
        merged.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        return merged;
    }

    public void markAsRead(String userId, String notificationId) {
        List<Notification> list = userNotifications.get(userId);
        if (list != null) {
            list.stream().filter(n -> n.getId().equals(notificationId)).findFirst().ifPresent(n -> n.setRead(true));
        }
    }

    public List<Notification> getRecentLogs() {
        return new ArrayList<>(notificationLog);
    }
}
