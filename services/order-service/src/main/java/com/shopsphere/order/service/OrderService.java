package com.shopsphere.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.common.dto.PageResponse;
import com.shopsphere.common.enums.OrderStatus;
import com.shopsphere.common.enums.PaymentStatus;
import com.shopsphere.common.events.BaseEvent;
import com.shopsphere.common.events.KafkaTopics;
import com.shopsphere.common.events.OrderEvents;
import com.shopsphere.common.exception.BadRequestException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.common.outbox.OutboxEvent;
import com.shopsphere.common.outbox.OutboxEventRepository;
import com.shopsphere.common.outbox.OutboxStatus;
import com.shopsphere.order.dto.CreateOrderRequest;
import com.shopsphere.order.dto.OrderResponse;
import com.shopsphere.order.entity.Order;
import com.shopsphere.order.entity.OrderAddress;
import com.shopsphere.order.entity.OrderItem;
import com.shopsphere.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public OrderResponse createOrder(String customerId, CreateOrderRequest request) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CreateOrderRequest.OrderItemDto itemDto : request.getItems()) {
            BigDecimal itemTotal = itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal discount = request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO;
        BigDecimal discountedSubtotal = subtotal.subtract(discount);
        if (discountedSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            discountedSubtotal = BigDecimal.ZERO;
        }

        BigDecimal tax = discountedSubtotal.multiply(BigDecimal.valueOf(0.08));
        BigDecimal shippingFee = discountedSubtotal.compareTo(BigDecimal.valueOf(100)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(15.00);
        BigDecimal totalAmount = discountedSubtotal.add(tax).add(shippingFee);

        String orderNumber = "ORD-" + System.currentTimeMillis() % 10000000 + "-" + (100 + new Random().nextInt(900));

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customerId(customerId)
                .customerEmail(request.getCustomerEmail())
                .status(OrderStatus.PENDING)
                .subtotal(subtotal)
                .discount(discount)
                .tax(tax)
                .shippingFee(shippingFee)
                .totalAmount(totalAmount)
                .couponCode(request.getCouponCode())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.INITIATED)
                .notes(request.getNotes())
                .build();

        List<OrderItem> items = new ArrayList<>();
        for (CreateOrderRequest.OrderItemDto itemDto : request.getItems()) {
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .productId(itemDto.getProductId())
                    .productName(itemDto.getProductName())
                    .sku(itemDto.getSku())
                    .productImage(itemDto.getProductImage())
                    .unitPrice(itemDto.getUnitPrice())
                    .quantity(itemDto.getQuantity())
                    .subtotal(itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())))
                    .build();
            items.add(item);
        }
        order.setItems(items);

        CreateOrderRequest.ShippingAddressDto addrDto = request.getShippingAddress();
        OrderAddress address = OrderAddress.builder()
                .order(order)
                .recipientName(addrDto.getRecipientName())
                .street(addrDto.getStreet())
                .city(addrDto.getCity())
                .state(addrDto.getState())
                .postalCode(addrDto.getPostalCode())
                .country(addrDto.getCountry())
                .phoneNumber(addrDto.getPhoneNumber())
                .build();
        order.setShippingAddress(address);

        order = orderRepository.save(order);

        // Transactional Outbox Event for ORDER_CREATED
        List<OrderEvents.OrderItemPayload> itemPayloads = order.getItems().stream().map(i ->
                OrderEvents.OrderItemPayload.builder()
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .sku(i.getSku())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .subtotal(i.getSubtotal())
                        .build()
        ).collect(Collectors.toList());

        OrderEvents.ShippingAddressPayload addressPayload = OrderEvents.ShippingAddressPayload.builder()
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .phoneNumber(address.getPhoneNumber())
                .build();

        OrderEvents.OrderCreatedPayload payload = OrderEvents.OrderCreatedPayload.builder()
                .orderId(order.getId().toString())
                .customerId(order.getCustomerId())
                .customerEmail(order.getCustomerEmail())
                .items(itemPayloads)
                .subtotal(order.getSubtotal())
                .discount(order.getDiscount())
                .tax(order.getTax())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .couponCode(order.getCouponCode())
                .paymentMethod(order.getPaymentMethod().name())
                .shippingAddress(addressPayload)
                .build();

        saveOutboxEvent(order.getId().toString(), "ORDER_CREATED", payload);
        log.info("Created order: {} [{}] for customer: {}", order.getOrderNumber(), order.getId(), customerId);

        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id.toString()));
        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getUserOrders(String customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);

        List<OrderResponse> content = orderPage.getContent().stream().map(this::toResponse).collect(Collectors.toList());

        return PageResponse.<OrderResponse>builder()
                .content(content)
                .pageNumber(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .isFirst(orderPage.isFirst())
                .isLast(orderPage.isLast())
                .build();
    }

    @Transactional
    public OrderResponse cancelOrder(String customerId, UUID orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId.toString()));

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel an order that has already been shipped or delivered");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        List<OrderEvents.OrderItemPayload> itemPayloads = order.getItems().stream().map(i ->
                OrderEvents.OrderItemPayload.builder()
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .sku(i.getSku())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .subtotal(i.getSubtotal())
                        .build()
        ).collect(Collectors.toList());

        saveOutboxEvent(
                order.getId().toString(),
                "ORDER_CANCELLED",
                OrderEvents.OrderCancelledPayload.builder()
                        .orderId(order.getId().toString())
                        .customerId(order.getCustomerId())
                        .customerEmail(order.getCustomerEmail())
                        .reason(reason != null ? reason : "Cancelled by customer")
                        .items(itemPayloads)
                        .build()
        );

        return toResponse(order);
    }

    @Transactional
    public void updateStatusFromEvent(String orderId, OrderStatus status, PaymentStatus paymentStatus, String trackingNumber, String carrier) {
        try {
            UUID id = UUID.fromString(orderId);
            orderRepository.findById(id).ifPresent(order -> {
                if (status != null) {
                    order.setStatus(status);
                }
                if (paymentStatus != null) {
                    order.setPaymentStatus(paymentStatus);
                }
                if (trackingNumber != null) {
                    order.setTrackingNumber(trackingNumber);
                }
                if (carrier != null) {
                    order.setCarrier(carrier);
                }
                orderRepository.save(order);
                log.info("Updated order [{}] status to: {}", orderId, status);
            });
        } catch (Exception e) {
            log.error("Failed to update order status for orderId [{}]: {}", orderId, e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(int page, int size, OrderStatus status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = status != null
                ? orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                : orderRepository.findAll(pageable);

        List<OrderResponse> content = orderPage.getContent().stream().map(this::toResponse).collect(Collectors.toList());

        return PageResponse.<OrderResponse>builder()
                .content(content)
                .pageNumber(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .isFirst(orderPage.isFirst())
                .isLast(orderPage.isLast())
                .build();
    }

    private void saveOutboxEvent(String aggregateId, String eventType, Object payload) {
        try {
            BaseEvent<Object> event = BaseEvent.builder()
                    .eventType(eventType)
                    .aggregateId(aggregateId)
                    .payload(payload)
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("ORDER")
                    .aggregateId(aggregateId)
                    .eventType(eventType)
                    .topic(KafkaTopics.ORDER_EVENTS)
                    .payload(objectMapper.writeValueAsString(event))
                    .status(OutboxStatus.PENDING)
                    .build();

            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            log.error("Failed to write order outbox event [{}]: {}", eventType, e.getMessage());
        }
    }

    private OrderResponse toResponse(Order o) {
        List<OrderResponse.OrderItemResponse> itemResponses = o.getItems().stream().map(i ->
                OrderResponse.OrderItemResponse.builder()
                        .id(i.getId())
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .sku(i.getSku())
                        .productImage(i.getProductImage())
                        .unitPrice(i.getUnitPrice())
                        .quantity(i.getQuantity())
                        .subtotal(i.getSubtotal())
                        .build()
        ).collect(Collectors.toList());

        OrderResponse.ShippingAddressResponse addressResponse = null;
        if (o.getShippingAddress() != null) {
            OrderAddress a = o.getShippingAddress();
            addressResponse = OrderResponse.ShippingAddressResponse.builder()
                    .id(a.getId())
                    .recipientName(a.getRecipientName())
                    .street(a.getStreet())
                    .city(a.getCity())
                    .state(a.getState())
                    .postalCode(a.getPostalCode())
                    .country(a.getCountry())
                    .phoneNumber(a.getPhoneNumber())
                    .build();
        }

        return OrderResponse.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .customerId(o.getCustomerId())
                .customerEmail(o.getCustomerEmail())
                .status(o.getStatus())
                .subtotal(o.getSubtotal())
                .discount(o.getDiscount())
                .tax(o.getTax())
                .shippingFee(o.getShippingFee())
                .totalAmount(o.getTotalAmount())
                .couponCode(o.getCouponCode())
                .paymentMethod(o.getPaymentMethod())
                .paymentStatus(o.getPaymentStatus())
                .trackingNumber(o.getTrackingNumber())
                .carrier(o.getCarrier())
                .notes(o.getNotes())
                .items(itemResponses)
                .shippingAddress(addressResponse)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}
