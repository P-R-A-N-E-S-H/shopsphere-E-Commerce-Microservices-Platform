package com.shopsphere.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class UserEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserRegisteredPayload {
        private String userId;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserUpdatedPayload {
        private String userId;
        private String email;
        private String firstName;
        private String lastName;
        private String phone;
    }
}
