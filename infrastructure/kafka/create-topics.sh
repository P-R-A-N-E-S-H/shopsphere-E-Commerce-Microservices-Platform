#!/bin/bash
# Create Kafka Topics for ShopSphere Event-Driven Architecture

KAFKA_BROKER=${KAFKA_BROKER:-"localhost:9092"}

echo "Creating Kafka topics on broker: $KAFKA_BROKER"

TOPICS=(
  "user-events"
  "product-events"
  "inventory-events"
  "order-events"
  "payment-events"
  "shipping-events"
  "notification-events"
  "analytics-events"
)

for TOPIC in "${TOPICS[@]}"; do
  kafka-topics.sh --bootstrap-server "$KAFKA_BROKER" --create --if-not-exists \
    --topic "$TOPIC" \
    --partitions 3 \
    --replication-factor 1
  echo "Topic '$TOPIC' initialized."
done

echo "All ShopSphere Kafka topics successfully configured."
