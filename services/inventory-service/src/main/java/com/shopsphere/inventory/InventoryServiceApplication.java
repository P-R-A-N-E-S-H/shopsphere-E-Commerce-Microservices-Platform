package com.shopsphere.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.inventory", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.inventory.entity", "com.shopsphere.common.outbox"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.inventory.repository", "com.shopsphere.common.outbox"})
@EnableScheduling
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }
}
