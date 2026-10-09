package com.shopsphere.ai.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import com.shopsphere.common.events.KafkaTopics;

@Configuration
public class KafkaAiConfig {

    @Bean
    public NewTopic aiInsightsTopic() {
        return TopicBuilder.name(KafkaTopics.AI_INSIGHTS_EVENTS)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic dynamicPricingTopic() {
        return TopicBuilder.name(KafkaTopics.DYNAMIC_PRICING_EVENTS)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic fraudAlertTopic() {
        return TopicBuilder.name(KafkaTopics.FRAUD_ALERT_EVENTS)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic autonomousRestockTopic() {
        return TopicBuilder.name(KafkaTopics.AUTONOMOUS_RESTOCK_EVENTS)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
