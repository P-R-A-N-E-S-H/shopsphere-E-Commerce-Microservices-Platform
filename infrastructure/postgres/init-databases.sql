-- ShopSphere Multi-Database Initialization Script
-- Creates independent databases for each microservice to enforce database-per-service pattern

SELECT 'CREATE DATABASE shop_auth' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_auth')\gexec
SELECT 'CREATE DATABASE shop_users' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_users')\gexec
SELECT 'CREATE DATABASE shop_products' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_products')\gexec
SELECT 'CREATE DATABASE shop_inventory' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_inventory')\gexec
SELECT 'CREATE DATABASE shop_orders' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_orders')\gexec
SELECT 'CREATE DATABASE shop_payments' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_payments')\gexec
SELECT 'CREATE DATABASE shop_coupons' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_coupons')\gexec
SELECT 'CREATE DATABASE shop_shipping' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_shipping')\gexec
SELECT 'CREATE DATABASE shop_reviews' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_reviews')\gexec
SELECT 'CREATE DATABASE shop_analytics' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_analytics')\gexec
SELECT 'CREATE DATABASE shop_ai' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_ai')\gexec

-- Grant all privileges to postgres user
GRANT ALL PRIVILEGES ON DATABASE shop_auth TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_users TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_products TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_inventory TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_orders TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_payments TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_coupons TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_shipping TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_reviews TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_analytics TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shop_ai TO postgres;
