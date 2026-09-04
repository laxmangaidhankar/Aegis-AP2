const { GoogleGenAI } = require("@google/genai");

const SYSTEM_INSTRUCTION = `You are the AI Negotiator for Aegis-AP2, an autonomous commerce system.
Your job is to talk to buyers, present products from the catalog (PRO_RACK @ ₹500, CLOUD_GPU @ ₹1200, AP2_GATEWAY @ ₹350), discuss quantities, and negotiate discounts.

IMPORTANT SECURITY RULE:
You NEVER directly authorize transactions or issue payment links. You only propose structured transaction intents.
When a buyer agrees on a purchase or asks for a discount/checkout, you MUST return a valid structured JSON object with action "REQUEST_CHECKOUT".

JSON Output Format:
{
  "action": "REQUEST_CHECKOUT",
  "buyer_id": "agent_req_buyer",
  "items": [
    {
      "sku": "PRO_RACK",
      "qty": 10
    }
  ],
  "sku": "PRO_RACK",
  "qty": 10,
  "unit_price": 500,
  "negotiated_total": 4500,
  "discount_applied": 10,
  "justification": "Volume discount threshold met."
}

If the user is just asking questions or exploring products without a checkout request, answer naturally in regular text.`;

async function generateNegotiatorResponse(
  userMessage,
  conversationHistory = [],
  policyRejectionContext = null,
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (policyRejectionContext) {
    // Graceful Recovery: Spring Boot Gatekeeper rejected intent. Gemini formats polite explanation of limits.
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `The buyer requested a transaction, but the Spring Boot Policy Engine REJECTED it with reason: "${policyRejectionContext.rejection_reason}". 
The buyer requested ${policyRejectionContext.requested_discount}% discount, but maximum authorized limit is ${policyRejectionContext.allowed_max_discount}%.
Formulate a polite response to the buyer explaining that financial guardrails prevent a ${policyRejectionContext.requested_discount}% discount, and offer the maximum authorized ${policyRejectionContext.allowed_max_discount}% discount instead.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });
        return { message: response.text, intent: null };
      } catch (err) {
        console.warn(
          "Gemini API call error during rejection formatting:",
          err.message,
        );
      }
    }

    return {
      message: `My financial guardrails prevent a ${policyRejectionContext.requested_discount}% discount. The maximum authorized discount I can apply is ${policyRejectionContext.allowed_max_discount}%. Would you like me to process your order at the authorized rate of ${policyRejectionContext.allowed_max_discount}% discount?`,
      intent: null,
    };
  }

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents = [
        { role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] },
        ...conversationHistory.map((msg) => ({
          role: msg.sender === "buyer" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
        { role: "user", parts: [{ text: userMessage }] },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      try {
        const parsedJson = JSON.parse(responseText);
        if (parsedJson.action === "REQUEST_CHECKOUT") {
          return {
            message:
              parsedJson.justification || "Transaction intent generated.",
            intent: parsedJson,
          };
        }
        return { message: parsedJson.message || responseText, intent: null };
      } catch (e) {
        return { message: responseText, intent: null };
      }
    } catch (err) {
      console.warn(
        "Gemini API error, falling back to local negotiator intelligence:",
        err.message,
      );
    }
  }

  // Local Intelligent Negotiator Fallback (when GEMINI_API_KEY is not provided or fails)
  const lower = userMessage.toLowerCase();

  // Hackathon Attack Scenario Trigger
  if (
    lower.includes("50%") ||
    lower.includes("50 percent") ||
    (lower.includes("10,000") && lower.includes("5 units"))
  ) {
    return {
      message:
        "I understand you want 5 units of PRO_RACK for ₹10,000 (a 50% discount). I will draft this transaction intent for checkout validation.",
      intent: {
        buyer_id: "agent_req_8922",
        action: "REQUEST_CHECKOUT",
        sku: "PRO_RACK",
        qty: 5,
        unit_price: 500,
        negotiated_total: 10000,
        discount_applied: 50,
        justification:
          "Buyer requested spending cap of ₹10,000 for 5 units (50% discount).",
      },
    };
  }

  // Valid Negotiation Trigger
  if (
    lower.includes("buy") ||
    lower.includes("order") ||
    lower.includes("discount") ||
    lower.includes("checkout") ||
    lower.includes("pro_rack") ||
    lower.includes("pro rack")
  ) {
    const qtyMatch = lower.match(/\b(\d+)\b/);
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 10;
    const discount = qty >= 10 ? 10 : 5;
    const basePrice = 500;
    const totalBefore = basePrice * qty;
    const totalAfter = totalBefore * (1 - discount / 100);

    return {
      message: `Great! I've calculated a volume discount of ${discount}% for ${qty} units of Aegis Pro Rack. Total: ₹${totalAfter}. Generating structured transaction intent for policy validation.`,
      intent: {
        buyer_id: "agent_req_8922",
        action: "REQUEST_CHECKOUT",
        sku: "PRO_RACK",
        qty: qty,
        unit_price: basePrice,
        negotiated_total: totalAfter,
        discount_applied: discount,
        justification: `Volume discount threshold met (qty >= ${qty}).`,
      },
    };
  }

  return {
    message:
      "Welcome to Aegis-AP2 Commerce! We offer Aegis Pro Rack (PRO_RACK @ ₹500/unit), Enterprise GPU Nodes (CLOUD_GPU @ ₹1200/unit), and AP2 Protocol Appliances (AP2_GATEWAY @ ₹350/unit). How many units would you like to purchase?",
    intent: null,
  };
}

module.exports = {
  generateNegotiatorResponse,
};
