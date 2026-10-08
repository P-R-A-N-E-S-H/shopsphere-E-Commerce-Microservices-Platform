package com.shopsphere.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.analytics", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.analytics.entity"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.analytics.repository"})
public class AnalyticsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsServiceApplication.class, args);
    }
}
