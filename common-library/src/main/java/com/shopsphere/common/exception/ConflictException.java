package com.shopsphere.common.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends ShopSphereException {
    public ConflictException(String message) {
        super("CONFLICT", message, HttpStatus.CONFLICT);
    }

    public ConflictException(String errorCode, String message) {
        super(errorCode, message, HttpStatus.CONFLICT);
    }
}
