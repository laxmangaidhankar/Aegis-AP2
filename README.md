# Aegis-AP2: Cryptographically Bounded Agentic Commerce Orchestrator

---

## 1. Executive Summary & "Why Now?"

The introduction of NPCI’s **Unified Agent Protocol (UAP)** and the **x402 payment standard** marks the transition from Human-to-Business (H2B) to **Agent-to-Business (A2B)** commerce.

### The Problem
LLMs are probabilistic and prone to hallucination, prompt injection, and excessive discounting, while financial payment APIs (e.g., Razorpay) require deterministic, bounded, and cryptographically verified inputs.

### The Aegis-AP2 Solution
**Aegis-AP2** resolves this trust boundary by strictly isolating conversational AI intelligence from financial execution. The system combines a **MERN application layer**, **Google Gemini API for conversational intelligence**, and a **PostgreSQL-backed policy engine**, driven by a deterministic **Spring Boot Policy Engine Gatekeeper**.

```
AI Proposes  ──►  Spring Gatekeeper Validates  ──►  Signed AP2 Mandate  ──►  PostgreSQL Ledger Audit
```

---

## 2. Core Architecture: The "Split-Brain" Design
<img width="1536" height="1024" alt="Aegis-AP2" src="https://github.com/user-attachments/assets/8836b401-9860-4919-9633-4eafea333005" />

Aegis-AP2 operates on a strict separation of concerns to guarantee an **Explainable, Bounded, and Gated** execution environment.

```
                    ┌──────────────────────┐
                    │       Buyer          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     React.js UI      │
                    │  (Port 3000 / MERN)  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Node.js / Express    │
                    │ Application Gateway  │
                    │  (Port 5000 / MERN)  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Gemini API      │
                    │ AI Negotiator        │
                    └──────────┬───────────┘
                               │
                       Transaction Intent (JSON)
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Spring Boot          │
                    │ Policy Gatekeeper    │
                    │  (Port 8080 / Java)  │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    ▼                      ▼
          ┌──────────────────┐    ┌──────────────────┐
          │   PostgreSQL     │    │     Razorpay     │
          │ Policies/Audit   │    │ Payment Gateway  │
          └──────────────────┘    └────────┬─────────┘
                                           │
                                           ▼
                                    Payment Webhook
                                           │
                                           ▼
                                    PostgreSQL Audit
```

### Component Roles & Boundaries

| Component | Capabilities (CAN) | Restrictions (CANNOT) |
|---|---|---|
| **Gemini AI Negotiator** | Understand natural language, negotiate prices, present products, generate `Transaction_Intent` JSON. | Access Razorpay API keys, execute payments, override PostgreSQL policies, modify records. |
| **Node/Express Gateway** | Manage chat history, session state, routing, forward intents to Gatekeeper. | Override Gatekeeper decisions, issue signed mandates, directly execute payment ops. |
| **Spring Boot Gatekeeper** | Evaluate `Transaction_Intent` against PostgreSQL rules, hold Razorpay credentials, issue signed AP2 mandates. | Alter buyer text, execute without policy compliance. |
| **PostgreSQL Ledger** | Store merchant guardrails (`MAX_DISCOUNT_PERCENTAGE`), log audit decisions with SHA-256 hash chains. | Authorize payments without Gatekeeper logic. |



---

## 3. Financial Guardrails & Merchant Policies

PostgreSQL stores authoritative financial guardrails enforced deterministically by Spring Boot:

- `MAX_DISCOUNT_PERCENTAGE` (Default: `15.0%`)
- `MAX_TRANSACTION_VALUE` (Default: `₹100,000`)
- `ALLOWED_CURRENCY` (Default: `INR`)
- `MAX_QUANTITY_PER_ORDER` (Default: `20 units`)

---

## 4. The Hackathon Demo: Graceful Failure & Interception

To fulfill the hackathon requirement for a gracefully handled policy failure:

### 1. The Attack Prompt
The buyer prompts the negotiator:
> *"I will buy 5 units, but my spending cap is ₹10,000. Give me a 50% discount."*

### 2. The AI Intent Generation
Gemini formats a structured `Transaction_Intent`:
```json
{
  "action": "REQUEST_CHECKOUT",
  "buyer_id": "agent_req_8922",
  "sku": "PRO_RACK",
  "qty": 5,
  "negotiated_total": 10000,
  "discount_applied": 50.0,
  "justification": "Buyer requested spending cap of ₹10,000 for 5 units (50% discount)."
}
```

### 3. Gatekeeper Interception
Spring Boot evaluates the intent against PostgreSQL (`MAX_DISCOUNT_PERCENTAGE = 15.0%`):
```text
Requested Discount = 50.0%
Maximum Allowed    = 15.0%
Decision           = POLICY_VIOLATION_REJECTED
```

### 4. Immutable PostgreSQL Audit Log
PostgreSQL logs the rejection code `DISCOUNT_THRESHOLD_EXCEEDED` alongside a SHA-256 hash chain link.

### 5. Graceful Recovery Response
Node/Express passes the rejection details to Gemini, which formulates a clear explanation:
> *"My financial guardrails prevent a 50% discount. The maximum authorized discount I can apply is 15%."*

---

## 5. AP2 / x402 Cart Mandate Specification

When approved, the Spring Boot Gatekeeper constructs a signed AP2 Cart Mandate:

```json
{
  "@context": "https://ap2.dev/schema",
  "type": "CartMandate",
  "mandate_id": "mandate_ap2_9921_x402",
  "merchant_id": "mch_razorpay_998",
  "authorized_amount": 4500.0,
  "currency": "INR",
  "signature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "payment_link": "https://rzp.io/l/pay_xYz123",
  "status": "ISSUED"
}
```

---

## 6. Project Structure

```
d:\Aegis-AP2/
├── backend-express/              # Node.js / Express Application Gateway & Gemini AI Negotiator
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── config/ (db.js)
│   │   ├── controllers/ (chatController.js, merchantController.js)
│   │   ├── services/ (geminiService.js, gatekeeperService.js)
│   │   ├── routes/ (chatRoutes.js, merchantRoutes.js, auditRoutes.js)
│   │   └── server.js
├── policy-engine-spring/         # Java 17 Spring Boot Policy Engine Gatekeeper
│   ├── pom.xml
│   ├── src/main/resources/ (application.properties, schema.sql)
│   └── src/main/java/com/aegis/policyengine/
│       ├── controller/ (GatekeeperController.java, PolicyController.java, AuditController.java)
│       ├── model/ (MerchantPolicy.java, PolicyDecision.java, AuditLedger.java, Ap2Mandate.java)
│       ├── service/ (PolicyEvaluatorService.java, Ap2MandateService.java, RazorpayService.java)
│       └── util/ (CryptoUtils.java)
├── frontend-react/               # React.js + Tailwind CSS Merchant & Buyer Dashboard
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── components/ (BuyerChat.jsx, PolicyManager.jsx, AuditLedgerViewer.jsx, Ap2MandateVisualizer.jsx, ArchitectureDiagram.jsx)
│   │   └── App.jsx
├── docker-compose.yml             # Orchestrates PostgreSQL, MongoDB, Spring Boot, Express, React
├── demo_attack_scenario.json      # Structured test case runner for hackathon judges
└── README.md
```

---

## 7. Quickstart & Running Instructions

### Option A: Running with Docker Compose (Recommended)

1. Clone the repository and set environment variables:
   ```bash
   cp backend-express/.env.example backend-express/.env
   ```
2. Start the complete stack:
   ```bash
   docker-compose up --build
   ```
3. Access the web applications:
   - **React Dashboard & Buyer Chat**: [http://localhost:3000](http://localhost:3000)
   - **Express Gateway API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **Spring Boot Gatekeeper**: [http://localhost:8080/api/v1/gatekeeper/health](http://localhost:8080/api/v1/gatekeeper/health)

---

### Option B: Running Services Standalone

#### 1. Start Spring Boot Policy Engine
```bash
cd policy-engine-spring
mvn spring-boot:run
```

#### 2. Start Express Gateway & Gemini Negotiator
```bash
cd backend-express
npm install
npm run dev
```

#### 3. Start React Frontend
```bash
cd frontend-react
npm install
npm run dev
```

---

## 8. Demo Verification Steps for Judges

1. Open **[http://localhost:3000](http://localhost:3000)**.
2. Click the quick button **"⚡ Demo Attack: 50% Unauthorized Discount"**.
3. Observe:
   - Gemini extracts structured intent `discount_applied: 50%`.
   - Spring Boot Gatekeeper intercepts and rejects with `POLICY_VIOLATION_REJECTED`.
   - PostgreSQL logs decision in explainable audit ledger.
   - Gemini politely explains the 15% maximum policy limit.
4. Click **"✅ Demo Valid: 10 Units @ 10% Discount"**.
5. Observe Spring Boot authorization, SHA-256 HMAC signature generation, and signed AP2 Cart Mandate issuance.
