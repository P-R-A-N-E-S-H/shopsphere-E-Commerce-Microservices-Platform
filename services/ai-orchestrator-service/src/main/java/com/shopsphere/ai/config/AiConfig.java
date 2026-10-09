package com.shopsphere.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "ai")
public class AiConfig {

    private EngineConfig engine = new EngineConfig();
    private AgentsConfig agents = new AgentsConfig();

    @Data
    public static class EngineConfig {
        private String model = "gemini-1.5-pro-preview";
        private int embeddingDimensions = 1536;
        private double temperature = 0.7;
        private int maxTokens = 2048;
        private String apiKey = "demo-api-key";
    }

    @Data
    public static class AgentsConfig {
        private AgentSetting concierge = new AgentSetting();
        private BargainSetting bargaining = new BargainSetting();
        private FraudSetting fraudRadar = new FraudSetting();
        private SupplyChainSetting supplyChain = new SupplyChainSetting();
    }

    @Data
    public static class AgentSetting {
        private boolean enabled = true;
        private int maxToolCalls = 5;
    }

    @Data
    public static class BargainSetting {
        private boolean enabled = true;
        private double maxDiscountPercent = 25.0;
        private double marginThresholdPercent = 15.0;
    }

    @Data
    public static class FraudSetting {
        private boolean enabled = true;
        private double highRiskThreshold = 75.0;
    }

    @Data
    public static class SupplyChainSetting {
        private boolean enabled = true;
        private int reorderLeadDays = 7;
    }
}
