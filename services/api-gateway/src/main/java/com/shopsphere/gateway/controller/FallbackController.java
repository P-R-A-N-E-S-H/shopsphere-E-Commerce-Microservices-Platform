package com.shopsphere.gateway.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.common.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/service")
    public Mono<ResponseEntity<ApiResponse<Void>>> serviceFallback() {
        ErrorResponse error = ErrorResponse.builder()
                .code("SERVICE_UNAVAILABLE")
                .message("Service is temporarily unavailable. Please try again later.")
                .build();
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(error, UUID.randomUUID().toString())));
    }
}
