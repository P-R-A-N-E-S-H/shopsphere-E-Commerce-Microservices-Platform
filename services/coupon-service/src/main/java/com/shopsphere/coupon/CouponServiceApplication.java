package com.shopsphere.coupon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.coupon", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.coupon.entity"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.coupon.repository"})
public class CouponServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CouponServiceApplication.class, args);
    }
}
