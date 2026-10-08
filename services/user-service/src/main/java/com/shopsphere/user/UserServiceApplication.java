package com.shopsphere.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.user", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.user.entity"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.user.repository"})
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
