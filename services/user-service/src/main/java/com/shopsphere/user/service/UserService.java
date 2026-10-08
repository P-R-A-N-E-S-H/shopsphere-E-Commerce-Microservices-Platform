package com.shopsphere.user.service;

import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.user.dto.UpdateProfileRequest;
import com.shopsphere.user.entity.UserProfile;
import com.shopsphere.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
    public UserProfile getProfile(UUID userId) {
        return userProfileRepository.findById(userId)
                .orElseGet(() -> {
                    // Lazy create default profile if it doesn't exist yet
                    UserProfile defaultProfile = UserProfile.builder()
                            .id(userId)
                            .email("user-" + userId + "@shopsphere.com")
                            .firstName("User")
                            .lastName("")
                            .build();
                    return userProfileRepository.save(defaultProfile);
                });
    }

    @Transactional
    public UserProfile updateProfile(UUID userId, UpdateProfileRequest request) {
        UserProfile profile = getProfile(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) {
            profile.setAvatarUrl(request.getAvatarUrl());
        }
        return userProfileRepository.save(profile);
    }

    @Transactional
    public void createOrUpdateFromAuth(UUID userId, String email, String firstName, String lastName, String phone) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElse(UserProfile.builder().id(userId).build());

        profile.setEmail(email);
        profile.setFirstName(firstName != null ? firstName : "User");
        profile.setLastName(lastName != null ? lastName : "");
        profile.setPhone(phone);
        userProfileRepository.save(profile);
        log.info("Synchronized user profile for userId: {}", userId);
    }
}
