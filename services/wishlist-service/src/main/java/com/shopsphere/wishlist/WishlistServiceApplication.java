package com.shopsphere.wishlist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

@SpringBootApplication(
        scanBasePackages = {"com.shopsphere.wishlist", "com.shopsphere.common"},
        exclude = {DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class}
)
public class WishlistServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(WishlistServiceApplication.class, args);
    }
}
