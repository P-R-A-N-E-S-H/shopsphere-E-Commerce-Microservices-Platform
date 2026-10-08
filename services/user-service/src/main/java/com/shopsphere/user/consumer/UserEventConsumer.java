package com.shopsphere.user.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.UserEvents;
import com.shopsphere.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventConsumer {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.USER_EVENTS, groupId = "user-service-group")
    public void consume(String message) {
        try {
            BaseEvent<UserEvents.UserRegisteredPayload> event = objectMapper.readValue(
                    message, new TypeReference<>() {}
            );

            if ("USER_REGISTERED".equals(event.getEventType()) && event.getPayload() != null) {
                UserEvents.UserRegisteredPayload payload = event.getPayload();
                userService.createOrUpdateFromAuth(
                        UUID.fromString(payload.getUserId()),
                        payload.getEmail(),
                        payload.getFirstName(),
                        payload.getLastName(),
                        payload.getPhone()
                );
                log.info("Handled USER_REGISTERED event for user ID: {}", payload.getUserId());
            }
        } catch (Exception e) {
            log.error("Failed to process message from topic {}: {}", KafkaTopics.USER_EVENTS, e.getMessage());
        }
    }
}
