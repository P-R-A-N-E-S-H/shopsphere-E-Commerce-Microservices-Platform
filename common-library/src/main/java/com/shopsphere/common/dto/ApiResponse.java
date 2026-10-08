package com.shopsphere.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private ErrorResponse error;
    
    @Builder.Default
    private String timestamp = Instant.now().toString();
    
    private String requestId;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(Instant.now().toString())
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now().toString())
                .build();
    }

    public static <T> ApiResponse<T> error(String code, String message, String requestId) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(new ErrorResponse(code, message, null))
                .requestId(requestId)
                .timestamp(Instant.now().toString())
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorResponse error, String requestId) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(error)
                .requestId(requestId)
                .timestamp(Instant.now().toString())
                .build();
    }
}
