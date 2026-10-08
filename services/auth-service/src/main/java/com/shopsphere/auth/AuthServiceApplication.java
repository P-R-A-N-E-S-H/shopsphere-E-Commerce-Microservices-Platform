package com.shopsphere.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.auth", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.auth.entity", "com.shopsphere.common.outbox"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.auth.repository", "com.shopsphere.common.outbox"})
@EnableScheduling
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
