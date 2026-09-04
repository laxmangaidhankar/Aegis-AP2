-- Aegis-AP2 Schema Initialization Script

-- Merchant Policies Table
CREATE TABLE IF NOT EXISTS merchant_policies (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) NOT NULL,
    max_discount_percentage DOUBLE PRECISION NOT NULL,
    max_transaction_value DOUBLE PRECISION NOT NULL,
    allowed_currency VARCHAR(10) NOT NULL,
    max_quantity_per_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Catalog Table
CREATE TABLE IF NOT EXISTS product_catalog (
    sku VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL,
    max_negotiable_discount DOUBLE PRECISION NOT NULL,
    stock_quantity INT NOT NULL,
    category VARCHAR(100)
);

-- Transaction Intents Log Table
CREATE TABLE IF NOT EXISTS transaction_intents (
    intent_id VARCHAR(64) PRIMARY KEY,
    buyer_id VARCHAR(64) NOT NULL,
    sku VARCHAR(64) NOT NULL,
    quantity INT NOT NULL,
    requested_unit_price DOUBLE PRECISION NOT NULL,
    requested_total DOUBLE PRECISION NOT NULL,
    requested_discount_pct DOUBLE PRECISION NOT NULL,
    justification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Policy Decisions Audit Ledger
CREATE TABLE IF NOT EXISTS policy_decisions (
    decision_id VARCHAR(64) PRIMARY KEY,
    intent_id VARCHAR(64) NOT NULL,
    buyer_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL, -- APPROVED, POLICY_VIOLATION_REJECTED
    rejection_code VARCHAR(64),
    rejection_reason TEXT,
    requested_discount_pct DOUBLE PRECISION,
    allowed_max_discount_pct DOUBLE PRECISION,
    requested_total DOUBLE PRECISION,
    allowed_max_total DOUBLE PRECISION,
    eval_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Ledger Hash Chain Table
CREATE TABLE IF NOT EXISTS audit_ledger (
    ledger_id VARCHAR(64) PRIMARY KEY,
    decision_id VARCHAR(64) NOT NULL,
    payload_hash VARCHAR(128) NOT NULL,
    previous_hash VARCHAR(128),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AP2 Cart Mandates Table
CREATE TABLE IF NOT EXISTS ap2_mandates (
    mandate_id VARCHAR(64) PRIMARY KEY,
    intent_id VARCHAR(64) NOT NULL,
    merchant_id VARCHAR(64) NOT NULL,
    authorized_amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL,
    cryptographic_signature TEXT NOT NULL,
    payment_link TEXT NOT NULL,
    status VARCHAR(32) NOT NULL, -- ISSUED, PAID, EXPIRED, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Merchant Guardrail Seed Data
INSERT INTO merchant_policies (id, merchant_id, max_discount_percentage, max_transaction_value, allowed_currency, max_quantity_per_order)
VALUES ('pol_default_001', 'mch_razorpay_998', 15.0, 100000.0, 'INR', 20)
ON CONFLICT (id) DO UPDATE SET 
    max_discount_percentage = EXCLUDED.max_discount_percentage,
    max_transaction_value = EXCLUDED.max_transaction_value;

-- Initial Product Catalog Seed Data
INSERT INTO product_catalog (sku, name, description, base_price, currency, max_negotiable_discount, stock_quantity, category)
VALUES 
('PRO_RACK', 'Aegis Pro Rack Server', 'Enterprise High-Performance AI Compute Rack', 500.0, 'INR', 15.0, 50, 'Hardware'),
('CLOUD_GPU', 'Enterprise GPU Node', 'Dedicated 8x H100 GPU Instance', 1200.0, 'INR', 12.0, 30, 'Cloud'),
('AP2_GATEWAY', 'AP2 Protocol Appliance', 'Hardware Security Module for x402 Commerce', 350.0, 'INR', 10.0, 100, 'Security')
ON CONFLICT (sku) DO UPDATE SET 
    base_price = EXCLUDED.base_price,
    max_negotiable_discount = EXCLUDED.max_negotiable_discount;
