package com.shopsphere.common.exception;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.common.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ShopSphereException.class)
    public ResponseEntity<ApiResponse<Void>> handleShopSphereException(ShopSphereException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        log.warn("ShopSphereException [{}]: {} - Request ID: {}", ex.getErrorCode(), ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(ex.getErrorCode())
                .message(ex.getMessage())
                .build();

        return ResponseEntity
                .status(ex.getStatus())
                .body(ApiResponse.error(errorResponse, requestId));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Validation failed for request ID {}: {}", requestId, errors);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("VALIDATION_ERROR")
                .message("Request validation failed")
                .fieldErrors(errors)
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(errorResponse, requestId));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        log.error("Unhandled server exception occurred. Request ID: {}", requestId, ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("INTERNAL_SERVER_ERROR")
                .message("An unexpected error occurred. Please try again later.")
                .build();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(errorResponse, requestId));
    }

    private String getRequestId(HttpServletRequest request) {
        if (request == null) {
            return UUID.randomUUID().toString();
        }
        String reqId = request.getHeader("X-Request-Id");
        if (reqId == null || reqId.isBlank()) {
            reqId = request.getHeader("X-Correlation-Id");
        }
        return reqId != null && !reqId.isBlank() ? reqId : UUID.randomUUID().toString();
    }
}
