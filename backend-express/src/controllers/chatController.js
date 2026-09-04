const { generateNegotiatorResponse } = require('../services/geminiService');
const { evaluateTransactionIntent } = require('../services/gatekeeperService');

const handleChatInteraction = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. AI Negotiator Reasoning via Gemini
    const negotiatorResult = await generateNegotiatorResponse(message, conversationHistory || []);

    if (!negotiatorResult.intent) {
      return res.json({
        response: negotiatorResult.message,
        intent: null,
        decision: null,
        ap2_mandate: null
      });
    }

    // 2. Transaction Intent Generated -> Intercepted & Forwarded to Spring Boot Gatekeeper
    const intentPayload = negotiatorResult.intent;
    const gatekeeperDecision = await evaluateTransactionIntent(intentPayload);

    if (gatekeeperDecision.status === 'APPROVED') {
      return res.json({
        response: `Deal finalized! Transaction approved by Spring Boot Gatekeeper. Signed AP2 Cart Mandate issued.`,
        intent: intentPayload,
        decision: gatekeeperDecision,
        ap2_mandate: gatekeeperDecision.ap2_mandate
      });
    } else {
      // 3. POLICY_VIOLATION_REJECTED -> Graceful Failure & Natural Language Fallback via Gemini
      const recoveryResponse = await generateNegotiatorResponse(
        message, 
        conversationHistory || [], 
        {
          rejection_reason: gatekeeperDecision.rejection_reason,
          requested_discount: gatekeeperDecision.requested_discount,
          allowed_max_discount: gatekeeperDecision.allowed_max_discount
        }
      );

      return res.json({
        response: recoveryResponse.message,
        intent: intentPayload,
        decision: gatekeeperDecision,
        ap2_mandate: null
      });
    }
  } catch (error) {
    console.error('Error in handleChatInteraction:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

module.exports = {
  handleChatInteraction
};
