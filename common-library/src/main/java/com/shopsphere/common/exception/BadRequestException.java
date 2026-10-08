package com.shopsphere.common.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends ShopSphereException {
    public BadRequestException(String message) {
        super("BAD_REQUEST", message, HttpStatus.BAD_REQUEST);
    }

    public BadRequestException(String errorCode, String message) {
        super(errorCode, message, HttpStatus.BAD_REQUEST);
    }
}
