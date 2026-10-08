package com.shopsphere.common.events;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseEvent<T> {

    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    private String eventType;

    @Builder.Default
    private int version = 1;

    @Builder.Default
    private String timestamp = Instant.now().toString();

    private String correlationId;

    private String aggregateId;

    private T payload;
}
