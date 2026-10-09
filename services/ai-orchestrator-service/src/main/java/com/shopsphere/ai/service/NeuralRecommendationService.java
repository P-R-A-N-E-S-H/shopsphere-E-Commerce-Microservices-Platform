package com.shopsphere.ai.service;

import com.shopsphere.ai.engine.LLMProviderEngine;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class NeuralRecommendationService {

    private final LLMProviderEngine llmEngine;

    @Data
    @Builder
    public static class NeuralRecommendationResult {
        private String customerId;
        private String neuralCluster;
        private Double affinityConfidence;
        private List<ProductAffinityNode> recommendedNodes;
        private SmartBundleRecommendation smartBundle;
    }

    @Data
    @Builder
    public static class ProductAffinityNode {
        private String productId;
        private String name;
        private BigDecimal price;
        private String category;
        private Double vectorSimilarity;
        private String affinityReason;
        private String imageUrl;
    }

    @Data
    @Builder
    public static class SmartBundleRecommendation {
        private String bundleId;
        private String title;
        private List<String> productIds;
        private List<String> productNames;
        private BigDecimal originalTotalPrice;
        private BigDecimal bundleDiscountPrice;
        private Double synergyScore; // 0 - 100
        private String aiSynergyInsight;
    }

    public NeuralRecommendationResult getPersonalizedGraph(String customerId, String currentProductId) {
        List<ProductAffinityNode> nodes = new ArrayList<>();

        nodes.add(ProductAffinityNode.builder()
                .productId("prod-2")
                .name("Sony WH-1000XM5 Wireless Headphones")
                .price(BigDecimal.valueOf(348.00))
                .category("Audio & Sound")
                .vectorSimilarity(0.96)
                .affinityReason("High latent co-occurrence with workstation & productivity setups")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80")
                .build());

        nodes.add(ProductAffinityNode.builder()
                .productId("prod-1")
                .name("MacBook Pro 16\" M3 Max")
                .price(BigDecimal.valueOf(3299.00))
                .category("Electronics & Gadgets")
                .vectorSimilarity(0.92)
                .affinityReason("Creative professional cluster affinity score 94.2%")
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80")
                .build());

        nodes.add(ProductAffinityNode.builder()
                .productId("prod-5")
                .name("Samsung Galaxy S24 Ultra Titanium")
                .price(BigDecimal.valueOf(1199.00))
                .category("Electronics & Gadgets")
                .vectorSimilarity(0.88)
                .affinityReason("Flagship ecosystem compatibility vector match")
                .imageUrl("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80")
                .build());

        SmartBundleRecommendation bundle = SmartBundleRecommendation.builder()
                .bundleId("bundle-cyber-creator")
                .title("Ultimate AI Creator & Power Workstation Suite")
                .productIds(List.of("prod-1", "prod-2"))
                .productNames(List.of("MacBook Pro 16\" M3 Max", "Sony WH-1000XM5 Wireless Headphones"))
                .originalTotalPrice(BigDecimal.valueOf(3647.00))
                .bundleDiscountPrice(BigDecimal.valueOf(3399.00))
                .synergyScore(98.4)
                .aiSynergyInsight("Neural analysis detects 89% productivity gain when pairing Apple Silicon with Sony's dual-processor ANC noise isolation.")
                .build();

        return NeuralRecommendationResult.builder()
                .customerId(customerId != null ? customerId : "guest-user")
                .neuralCluster("High-Performance Creative Tech & Audiophile")
                .affinityConfidence(0.94)
                .recommendedNodes(nodes)
                .smartBundle(bundle)
                .build();
    }
}
