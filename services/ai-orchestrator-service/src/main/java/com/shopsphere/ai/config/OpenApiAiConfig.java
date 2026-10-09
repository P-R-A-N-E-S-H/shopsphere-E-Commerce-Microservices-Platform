package com.shopsphere.ai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiAiConfig {

    @Bean
    public OpenAPI aiOrchestratorOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ShopSphere AI Orchestrator & Autonomous Agent Swarm API")
                        .description("Next-Gen AI Commerce Intelligence Engine with Dynamic Bargaining, Multimodal Vision, Neural Vector Recommendations, and Real-Time Fraud Sentinel")
                        .version("2.0.0")
                        .contact(new Contact()
                                .name("ShopSphere AI Engineering Team")
                                .email("ai-platform@shopsphere.io")
                                .url("https://shopsphere.io/ai"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
