package com.shopsphere.ai;

import com.shopsphere.ai.config.AiConfig;
import com.shopsphere.ai.repository.AiAgentLogRepository;
import com.shopsphere.ai.service.DynamicBargainingAgentService;
import com.shopsphere.common.dto.AIDTOs;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DynamicBargainingAgentServiceTest {

    @Mock
    private AiAgentLogRepository logRepository;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    private DynamicBargainingAgentService bargainingService;

    @BeforeEach
    void setUp() {
        AiConfig config = new AiConfig();
        config.getAgents().getBargaining().setMaxDiscountPercent(25.0);
        bargainingService = new DynamicBargainingAgentService(config, logRepository, Optional.of(kafkaTemplate));
    }

    @Test
    void testReasonableOfferIsAccepted() {
        AIDTOs.BargainNegotiateRequest request = AIDTOs.BargainNegotiateRequest.builder()
                .productId("prod-1")
                .sku("SKU-APPL-MBP-16")
                .productName("MacBook Pro 16")
                .currentPrice(BigDecimal.valueOf(1000.00))
                .offeredPrice(BigDecimal.valueOf(900.00)) // 10% off
                .customerLoyaltyTier("GOLD")
                .round(1)
                .build();

        AIDTOs.BargainNegotiateResponse response = bargainingService.negotiatePrice(request);

        assertNotNull(response);
        assertEquals("ACCEPTED", response.getStatus());
        assertEquals(BigDecimal.valueOf(900.00), response.getAcceptedPrice());
        assertNotNull(response.getGeneratedCouponCode());
        assertTrue(response.getGeneratedCouponCode().startsWith("BARGAIN-"));
    }

    @Test
    void testExtremeLowballOfferTriggersCounterOffer() {
        AIDTOs.BargainNegotiateRequest request = AIDTOs.BargainNegotiateRequest.builder()
                .productId("prod-1")
                .sku("SKU-APPL-MBP-16")
                .productName("MacBook Pro 16")
                .currentPrice(BigDecimal.valueOf(1000.00))
                .offeredPrice(BigDecimal.valueOf(400.00)) // 60% off (below floor)
                .customerLoyaltyTier("BRONZE")
                .round(1)
                .build();

        AIDTOs.BargainNegotiateResponse response = bargainingService.negotiatePrice(request);

        assertNotNull(response);
        assertEquals("COUNTER_OFFER", response.getStatus());
        assertTrue(response.getCounterPrice().compareTo(BigDecimal.valueOf(400.00)) > 0);
        assertNotNull(response.getGeneratedCouponCode());
    }
}
