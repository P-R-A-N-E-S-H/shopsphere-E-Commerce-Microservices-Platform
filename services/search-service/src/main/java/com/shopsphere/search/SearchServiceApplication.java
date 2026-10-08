package com.shopsphere.search;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.shopsphere.search", "com.shopsphere.common"})
@EntityScan(basePackages = {"com.shopsphere.search.entity"})
@EnableJpaRepositories(basePackages = {"com.shopsphere.search.repository"})
public class SearchServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SearchServiceApplication.class, args);
    }
}
