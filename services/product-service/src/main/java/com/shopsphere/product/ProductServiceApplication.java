package com.shopsphere.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.product", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.product.entity", "com.shopsphere.common.outbox"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.product.repository", "com.shopsphere.common.outbox"})
@EnableCaching
@EnableScheduling
public class ProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }
}
