package com.shopsphere.review;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.review", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.review.entity"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.review.repository"})
public class ReviewServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReviewServiceApplication.class, args);
    }
}
