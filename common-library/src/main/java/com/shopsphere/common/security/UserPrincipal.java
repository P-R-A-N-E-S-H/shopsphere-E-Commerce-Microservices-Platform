package com.shopsphere.common.security;

import com.shopsphere.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal {
    private String userId;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;
}
