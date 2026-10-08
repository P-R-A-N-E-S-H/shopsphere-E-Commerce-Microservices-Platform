package com.shopsphere.shipping;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.shipping", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.shipping.entity", "com.shopsphere.common.outbox"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.shipping.repository", "com.shopsphere.common.outbox"})
@EnableScheduling
public class ShippingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShippingServiceApplication.class, args);
    }
}
