package com.shopsphere.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ShopSphereException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus status;

    public ShopSphereException(String errorCode, String message, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public ShopSphereException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
