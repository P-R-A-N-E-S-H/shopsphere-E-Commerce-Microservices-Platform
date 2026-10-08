package com.shopsphere.common.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends ShopSphereException {
    public UnauthorizedException(String message) {
        super("UNAUTHORIZED", message, HttpStatus.UNAUTHORIZED);
    }

    public UnauthorizedException(String errorCode, String message) {
        super(errorCode, message, HttpStatus.UNAUTHORIZED);
    }
}
