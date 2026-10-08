package com.shopsphere.notification.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.events.*;
import com.shopsphere.notification.model.Notification;
import com.shopsphere.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.USER_EVENTS, groupId = "notification-user-group")
    public void handleUserEvent(String message) {
        try {
            BaseEvent<Object> event = objectMapper.readValue(message, new TypeReference<>() {});
            if ("USER_REGISTERED".equals(event.getEventType())) {
                UserEvents.UserRegisteredPayload p = objectMapper.convertValue(event.getPayload(), UserEvents.UserRegisteredPayload.class);
                notificationService.sendNotification(Notification.builder()
                        .userId(p.getUserId())
                        .recipientEmail(p.getEmail())
                        .title("Welcome to ShopSphere!")
                        .message("Hi " + p.getFirstName() + ", thank you for joining ShopSphere. Enjoy premium shopping today!")
                        .type("USER")
                        .build());
            }
        } catch (Exception e) {
            log.error("Failed to parse user event in notification-service: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaTopics.ORDER_EVENTS, groupId = "notification-order-group")
    public void handleOrderEvent(String message) {
        try {
            BaseEvent<Object> event = objectMapper.readValue(message, new TypeReference<>() {});
            String type = event.getEventType();

            if ("ORDER_CREATED".equals(type)) {
                OrderEvents.OrderCreatedPayload p = objectMapper.convertValue(event.getPayload(), OrderEvents.OrderCreatedPayload.class);
                notificationService.sendNotification(Notification.builder()
                        .userId(p.getCustomerId())
                        .recipientEmail(p.getCustomerEmail())
                        .title("Order Placed Successfully")
                        .message("Your order #" + p.getOrderId() + " for $" + p.getTotalAmount() + " has been placed and is being prepared.")
                        .type("ORDER")
                        .build());
            } else if ("ORDER_CANCELLED".equals(type)) {
                OrderEvents.OrderCancelledPayload p = objectMapper.convertValue(event.getPayload(), OrderEvents.OrderCancelledPayload.class);
                notificationService.sendNotification(Notification.builder()
                        .userId(p.getCustomerId())
                        .recipientEmail(p.getCustomerEmail())
                        .title("Order Cancelled")
                        .message("Order #" + p.getOrderId() + " has been cancelled. Reason: " + p.getReason())
                        .type("ORDER")
                        .build());
            }
        } catch (Exception e) {
            log.error("Failed to parse order event in notification-service: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaTopics.PAYMENT_EVENTS, groupId = "notification-payment-group")
    public void handlePaymentEvent(String message) {
        try {
            BaseEvent<Object> event = objectMapper.readValue(message, new TypeReference<>() {});
            if ("PAYMENT_SUCCESS".equals(event.getEventType())) {
                PaymentEvents.PaymentSuccessPayload p = objectMapper.convertValue(event.getPayload(), PaymentEvents.PaymentSuccessPayload.class);
                notificationService.sendNotification(Notification.builder()
                        .userId(p.getCustomerId())
                        .title("Payment Received")
                        .message("Payment of $" + p.getAmount() + " via " + p.getPaymentMethod() + " confirmed. Ref: " + p.getTransactionReference())
                        .type("PAYMENT")
                        .build());
            }
        } catch (Exception e) {
            log.error("Failed to parse payment event in notification-service: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaTopics.SHIPPING_EVENTS, groupId = "notification-shipping-group")
    public void handleShippingEvent(String message) {
        try {
            BaseEvent<Object> event = objectMapper.readValue(message, new TypeReference<>() {});
            if ("SHIPPING_CREATED".equals(event.getEventType())) {
                ShippingEvents.ShippingCreatedPayload p = objectMapper.convertValue(event.getPayload(), ShippingEvents.ShippingCreatedPayload.class);
                notificationService.sendNotification(Notification.builder()
                        .userId(p.getCustomerId())
                        .title("Shipment Dispatched!")
                        .message("Your package has been dispatched via " + p.getCarrier() + ". Tracking number: " + p.getTrackingNumber())
                        .type("SHIPPING")
                        .build());
            }
        } catch (Exception e) {
            log.error("Failed to parse shipping event in notification-service: {}", e.getMessage());
        }
    }
}
