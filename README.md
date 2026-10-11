# ShopSphere AI: Enterprise Autonomous Multi-Agent E-Commerce Platform 🛍️🤖⚡

[![Java](https://img.shields.io/badge/Java-21-orange.svg?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![AI Agent Swarm](https://img.shields.io/badge/AI%20Swarm-6%20Agents%20Active-cyan.svg?style=flat-square&logo=openai)](https://openai.com/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-Distributed%20Events-black.svg?style=flat-square&logo=apachekafka)](https://kafka.apache.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Multi--Database-blue.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Multi--Tier%20Caching-red.svg?style=flat-square&logo=redis)](https://redis.io/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black.svg?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose%20Ready-2496ED.svg?style=flat-square&logo=docker)](https://www.docker.com/)

---

## 🌟 Overview

**ShopSphere AI** is a cutting-edge, production-grade **Autonomous Multi-Agent E-Commerce & Intelligence Ecosystem** engineered with **Java 21**, **Spring Boot 3.3.4**, **Apache Kafka**, **Redis**, **PostgreSQL**, and **Next.js 14**.

Beyond standard storefronts, ShopSphere AI integrates an autonomous multi-agent swarm capable of **real-time dynamic price bargaining**, **multimodal visual search & color palette vectorization**, **sub-10ms neural fraud risk scoring**, **predictive supply chain restock forecasting**, **aspect-based sentiment radar**, and **spatial voice commerce**.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Clients["Frontend & Intelligent Clients (Port 3000)"]
        Web["Next.js 14 Cyber-Luxe Storefront\n• OmniCopilot Multi-Turn AI Concierge\n• AI Bargaining Arena (Real-Time Margin Negotiation)\n• Multimodal Visual Search & AR Fit Lab\n• Neural Graph & Swarm Topology\n• Spatial Voice Commerce & Soundwave Synthesis\n• Aspect-Based Sentiment & Return Risk Radar"]
    end

    subgraph Edge["Edge Layer"]
        Gateway["Spring Cloud API Gateway\n(Port 8080)\nJWT Auth Validation & Routing\nResilience4j Circuit Breakers"]
    end

    subgraph AISwarm["AI Orchestrator & Autonomous Swarm (Port 8095)"]
        Orchestrator["AI Orchestrator Service\n• OmniConciergeAgent\n• DynamicBargainingAgent\n• MultimodalVisionService\n• NeuralRecommendationEngine\n• FraudRadarAgent\n• AutonomousSupplyChainAgent\n• SentimentRadarService\n• SpatialVoiceService"]
    end

    subgraph Microservices["Core Microservices Cluster"]
        Auth["Auth Service (Port 8081)\nJWT & Token Blacklist"]
        User["User Service (Port 8082)\nProfiles & Addresses"]
        Product["Product Service (Port 8083)\nCatalog & Cache-Aside"]
        Search["Search Service (Port 8084)\nFull-Text Search Engine"]
        Cart["Cart Service (Port 8085)\nRedis In-Memory Cart"]
        Wishlist["Wishlist Service (Port 8086)\nRedis Wishlists"]
        Inventory["Inventory Service (Port 8087)\nOptimistic Locking (@Version)"]
        Order["Order Service (Port 8088)\nSaga Coordinator & Outbox"]
        Payment["Payment Service (Port 8089)\nIdempotent Transactions"]
        Coupon["Coupon Service (Port 8090)\nRules Engine & Dynamic Promos"]
        Shipping["Shipping Service (Port 8091)\nFedEx Dispatch & Tracking"]
        Review["Review Service (Port 8092)\nVerified Ratings & Reviews"]
        Notification["Notification Service (Port 8093)\nEvent Feeds & Dispatches"]
        Analytics["Analytics Service (Port 8094)\nReal-Time Metrics & KPIs"]
    end

    subgraph DataPlane["Data & Event Mesh"]
        Kafka["Apache Kafka (Port 9092 / 29092)\n• ai-insights-events\n• dynamic-pricing-events\n• fraud-alert-events\n• autonomous-restock-events\n• order-events / inventory-events"]
        Redis["Redis Cache & Cluster (Port 6379)"]
        Postgres["PostgreSQL Multi-DB (Port 5432)\n• shop_auth, shop_users, shop_products\n• shop_orders, shop_payments, shop_ai..."]
    end

    Web --> Gateway
    Gateway --> AISwarm
    Gateway --> Auth
    Gateway --> User
    Gateway --> Product
    Gateway --> Search
    Gateway --> Cart
    Gateway --> Wishlist
    Gateway --> Inventory
    Gateway --> Order
    Gateway --> Payment
    Gateway --> Coupon
    Gateway --> Shipping
    Gateway --> Review
    Gateway --> Notification
    Gateway --> Analytics

    AISwarm --> Postgres
    AISwarm --> Kafka
    Order --> Kafka
    Payment --> Kafka
    Inventory --> Kafka
    Analytics --> Kafka
```

---

## 🤖 Autonomous AI Agent Swarm Matrix

| AI Agent | Role | Underlying Algorithms & Capabilities | Kafka Stream Topics |
|---|---|---|---|
| **OmniCopilot Concierge** | Conversational Assistant & Tool Executor | Multi-turn memory, intent routing, tool calling (`vector_catalog_search`, `audio_comparator`, `order_tracker`) | `ai-insights-events` |
| **Dynamic Bargaining Merchant** | Real-Time Price Negotiation | Margin floor boundary calculations, loyalty tier elasticity, multi-round counter-offers, single-use promo code generation | `dynamic-pricing-events` |
| **Multimodal Vision Sentinel** | Visual Search & Feature Extraction | Silhouette geometry parsing, hex color palette tensor extraction, cosine similarity vector scoring (1536-dim) | `ai-insights-events` |
| **Neural Recommendation Engine** | Vector Affinity Graph & Smart Bundles | Collaborative vector graph clustering, product synergy scoring, automated cross-sell bundle discounts | `ai-insights-events` |
| **Neural Fraud Sentinel** | Real-Time Risk Gate | Sub-10ms threat scoring, IP velocity tensor analysis, headless bot pattern recognition, explainable AI risk factors | `fraud-alert-events` |
| **Autonomous Supply Chain Agent** | Predictive Restock Forecaster | Demand velocity modeling, stockout probability forecasting, automated supplier PO reservations | `autonomous-restock-events` |
| **Aspect Sentiment Radar** | Review Sentiment & Return Risk | Aspect-level sentiment extraction (Build Quality, Ergonomics, Battery, Value), buyer trust indexing, return probability modeling | `review-events` |
| **Spatial Voice Commerce** | Natural Speech-to-Intent | Audio waveform processing, speech transcription, direct storefront intent slot extraction | `ai-insights-events` |

---

## 🚀 Microservices Cluster Matrix (15 Microservices)

| Microservice | Port | Database | Primary Technologies | Events Emitted / Consumed |
|---|---|---|---|---|
| **AI Orchestrator Service** | `8095` | PostgreSQL (`shop_ai`) | Multi-Agent Swarm, Vector Embeddings, Dynamic Margin Engine | Emits `ai-insights-events`, `dynamic-pricing-events`, `fraud-alert-events`, `autonomous-restock-events` |
| **API Gateway** | `8080` | None | Spring Cloud Gateway, Reactive Filters, JWT, Resilience4j | Enriches `X-User-Id`, `X-User-Role` headers |
| **Auth Service** | `8081` | PostgreSQL (`shop_auth`) | Spring Security 6, JWT, BCrypt, Redis Blacklist | Emits `user-events` (USER_REGISTERED) |
| **User Service** | `8082` | PostgreSQL (`shop_users`) | Spring Data JPA, Address Book CRUD | Consumes `user-events` |
| **Product Service** | `8083` | PostgreSQL (`shop_products`) | Redis Cache-Aside, Outbox Pattern | Emits `product-events` |
| **Search Service** | `8084` | PostgreSQL FullText | Full-Text ILIKE & Vector Indexing | Consumes `product-events` |
| **Cart Service** | `8085` | Redis In-Memory | Redis Template, Subtotal Calculator | Guest cart merging, TTL expiration |
| **Wishlist Service** | `8086` | Redis In-Memory | Redis Sets, Fast Lookup | Wishlist persistence |
| **Inventory Service** | `8087` | PostgreSQL (`shop_inventory`) | Optimistic Locking (`@Version`), Saga Participant | Consumes `order-events`, Emits `inventory-events` |
| **Order Service** | `8088` | PostgreSQL (`shop_orders`) | Saga Coordinator, State Machine, Outbox | Emits & Consumes `order-events` |
| **Payment Service** | `8089` | PostgreSQL (`shop_payments`) | Idempotency (`Idempotency-Key`), Mock Gateway | Consumes `order-events`, Emits `payment-events` |
| **Coupon Service** | `8090` | PostgreSQL (`shop_coupons`) | Discount Rules Engine (`SAVE20`, `WELCOME10`, `AIEXCLUSIVE15`) | Validates coupons & order minimums |
| **Shipping Service** | `8091` | PostgreSQL (`shop_shipping`) | FedEx Tracking (`TRK-FEDEX-XXXX`), Stepper | Consumes `order-events`, Emits `shipping-events` |
| **Review Service** | `8092` | PostgreSQL (`shop_reviews`) | Verified Ratings, Breakdown Aggregations | Verified purchase review management |
| **Notification Service** | `8093` | PostgreSQL / In-Memory | Multi-Channel Kafka Event Consumer | Consumes all event topics |
| **Analytics Service** | `8094` | PostgreSQL (`shop_analytics`) | Real-Time Kafka Stream Ingestion, AI ROI KPIs | Calculates revenue velocity & metrics |

---

## ⚡ Quick Start & Running Locally

### 1. Start Infrastructure & Microservices Cluster with Docker Compose
```bash
# Start PostgreSQL, Redis, Kafka, all 15 Microservices and Next.js Storefront
docker compose up -d --build
```

### 2. Run Frontend Locally (Next.js 14)
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:3000** to experience the interactive cyber-luxe AI storefront.

### 3. Access Swagger / OpenAPI 3.0 Documentation
- AI Orchestrator API Docs: `http://localhost:8095/swagger-ui.html`
- Product Service API Docs: `http://localhost:8083/swagger-ui.html`
- Order Service API Docs: `http://localhost:8088/swagger-ui.html`
- API Gateway Hub: `http://localhost:8080`

---

## 🛡️ License
Distributed under the Apache 2.0 License. Designed and engineered for high-throughput enterprise AI commerce.
