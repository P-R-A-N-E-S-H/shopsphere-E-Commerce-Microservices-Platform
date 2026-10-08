package com.shopsphere.common.events;

public final class KafkaTopics {

    private KafkaTopics() {}

    public static final String USER_EVENTS = "user-events";
    public static final String PRODUCT_EVENTS = "product-events";
    public static final String INVENTORY_EVENTS = "inventory-events";
    public static final String ORDER_EVENTS = "order-events";
    public static final String PAYMENT_EVENTS = "payment-events";
    public static final String SHIPPING_EVENTS = "shipping-events";
    public static final String NOTIFICATION_EVENTS = "notification-events";
    public static final String ANALYTICS_EVENTS = "analytics-events";
}
