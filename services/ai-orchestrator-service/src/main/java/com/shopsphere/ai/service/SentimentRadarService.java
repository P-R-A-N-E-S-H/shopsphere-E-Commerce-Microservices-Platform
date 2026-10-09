package com.shopsphere.ai.service;

import com.shopsphere.common.dto.AIDTOs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SentimentRadarService {

    public AIDTOs.SentimentRadarResponse analyzeProductSentiment(String productId) {
        String id = productId != null ? productId : "prod-1";

        Map<String, Double> aspectScores = new LinkedHashMap<>();
        List<String> positives = new ArrayList<>();
        List<String> concerns = new ArrayList<>();
        double sentimentScore = 94.5;
        double returnRisk = 3.2;
        String verdict = "OVERWHELMINGLY_POSITIVE";
        String name = "MacBook Pro 16\" M3 Max";

        if (id.contains("prod-2") || id.contains("sony")) {
            name = "Sony WH-1000XM5 Wireless Headphones";
            aspectScores.put("Active Noise Cancellation", 98.2);
            aspectScores.put("Acoustic Soundstage", 94.0);
            aspectScores.put("Comfort & Ergonomics", 91.5);
            aspectScores.put("Battery Longevity", 96.0);
            aspectScores.put("Microphone Call Clarity", 88.0);
            aspectScores.put("Build Material Feel", 89.5);

            positives.add("Industry leading ANC silences airplane engine hum and ambient office chatter instantly.");
            positives.add("Ultra-plush ear cups with breathable soft fit synthetic leather for 8+ hour sessions.");
            positives.add("Multipoint Bluetooth transition between laptop and phone is seamless.");

            concerns.add("Non-folding headband requires a slightly larger travel case.");
            returnRisk = 2.4;
            sentimentScore = 95.8;

        } else if (id.contains("prod-3") || id.contains("nike")) {
            name = "Nike Air Force 1 '07 Pro";
            aspectScores.put("Leather Quality", 91.0);
            aspectScores.put("Sole Cushioning", 88.5);
            aspectScores.put("Aesthetic Silhouette", 97.4);
            aspectScores.put("Sizing Accuracy", 92.0);
            aspectScores.put("Durability / Wear", 94.0);
            aspectScores.put("Value for Price", 93.5);

            positives.add("Classic timeless look that effortlessly matches both streetwear and smart-casual outfits.");
            positives.add("Thick durable cupsole with sturdy real leather upper.");

            concerns.add("Slight break-in period required for first 2-3 wears.");
            returnRisk = 4.1;
            sentimentScore = 92.5;

        } else {
            aspectScores.put("Computational Power", 99.1);
            aspectScores.put("Liquid Retina Display", 98.5);
            aspectScores.put("Battery Runtime (22h)", 97.8);
            aspectScores.put("Thermal Efficiency", 96.4);
            aspectScores.put("Keyboard & Trackpad", 95.0);
            aspectScores.put("Value / Investment", 89.2);

            positives.add("M3 Max exports 8K ProRes 422 video timelines with near-zero fan noise.");
            positives.add("Space Black anodized coating drastically resists finger oil smudges.");
            positives.add("Industry benchmark speakers with true studio bass depth.");

            concerns.add("High initial capital investment for maxed-out unified RAM tiers.");
            returnRisk = 1.8;
            sentimentScore = 97.2;
        }

        return AIDTOs.SentimentRadarResponse.builder()
                .productId(id)
                .productName(name)
                .overallSentimentScore(sentimentScore)
                .sentimentVerdict(verdict)
                .returnProbabilityPercent(returnRisk)
                .aspectScores(aspectScores)
                .topKeyPositives(positives)
                .topKeyConcerns(concerns)
                .verifiedBuyerTrustIndex(98.7)
                .build();
    }
}
