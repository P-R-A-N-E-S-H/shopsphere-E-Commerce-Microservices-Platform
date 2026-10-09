package com.shopsphere.ai.engine;

import com.shopsphere.ai.config.AiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class LLMProviderEngine {

    private final AiConfig aiConfig;

    /**
     * Compute cosine similarity between two float embedding vectors
     */
    public double calculateCosineSimilarity(float[] vectorA, float[] vectorB) {
        if (vectorA == null || vectorB == null || vectorA.length != vectorB.length) {
            return 0.0;
        }
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Generate deterministic high-dimensional mock embedding vector for text or product tags
     */
    public float[] generateEmbedding(String text) {
        int dims = aiConfig.getEngine().getEmbeddingDimensions();
        float[] vector = new float[dims];
        Random random = new Random(text.toLowerCase().trim().hashCode());
        for (int i = 0; i < dims; i++) {
            vector[i] = (float) (random.nextGaussian());
        }
        return vector;
    }

    /**
     * Synthesizes agent persona reasoning with simulated chain-of-thought
     */
    public List<String> synthesizeReasoningTrace(String agentName, String userIntent, String contextSummary) {
        List<String> traces = new ArrayList<>();
        traces.add(String.format("[%s] Analyzing customer intent: '%s'", agentName, userIntent));
        traces.add(String.format("[%s] Scanning vector knowledge embeddings & context: '%s'", agentName, contextSummary));
        traces.add(String.format("[%s] Evaluating real-time inventory, pricing margins, and user loyalty tier", agentName));
        traces.add(String.format("[%s] Formulating optimal agentic response & executable tool-calls", agentName));
        return traces;
    }
}
