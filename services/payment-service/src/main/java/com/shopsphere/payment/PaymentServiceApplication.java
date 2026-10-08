package com.shopsphere.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.payment", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.payment.entity", "com.shopsphere.common.outbox"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.payment.repository", "com.shopsphere.common.outbox"})
@EnableScheduling
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
