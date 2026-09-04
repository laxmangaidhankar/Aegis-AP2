const GATEKEEPER_URL = process.env.GATEKEEPER_URL || 'http://localhost:8080/api/v1/gatekeeper';

async function evaluateTransactionIntent(intentPayload) {
  try {
    const response = await fetch(`${GATEKEEPER_URL}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intentPayload)
    });

    if (!response.ok) {
      throw new Error(`Gatekeeper HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`Gatekeeper unreachable at ${GATEKEEPER_URL}. Executing standalone deterministic fallback engine:`, error.message);
    
    // Standalone fallback engine if Spring Boot isn't running on host
    const requestedDiscount = intentPayload.discount_applied || 0;
    const requestedTotal = intentPayload.negotiated_total || (intentPayload.unit_price * intentPayload.qty);
    const maxDiscountAllowed = 15.0;
    const maxTotalAllowed = 100000.0;

    if (requestedDiscount <= maxDiscountAllowed && requestedTotal <= maxTotalAllowed) {
      const mandateId = 'mandate_ap2_' + Math.random().toString(36).substring(2, 10);
      return {
        decision_id: 'dec_mock_' + Math.random().toString(36).substring(2, 8),
        intent_id: intentPayload.intent_id || 'int_mock_123',
        status: 'APPROVED',
        requested_discount: requestedDiscount,
        allowed_max_discount: maxDiscountAllowed,
        requested_total: requestedTotal,
        allowed_max_total: maxTotalAllowed,
        ap2_mandate: {
          "@context": "https://ap2.dev/schema",
          "type": "CartMandate",
          "mandate_id": mandateId,
          "merchant_id": intentPayload.merchant_id || "mch_razorpay_998",
          "authorized_amount": requestedTotal,
          "currency": "INR",
          "signature": "sha256_mock_cryptographic_signature_" + Math.random().toString(36).substring(2, 14),
          "payment_link": `https://rzp.io/l/pay_mock?mandate=${mandateId}&amount=${requestedTotal}`,
          "status": "ISSUED"
        },
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        decision_id: 'dec_mock_' + Math.random().toString(36).substring(2, 8),
        intent_id: intentPayload.intent_id || 'int_mock_123',
        status: 'POLICY_VIOLATION_REJECTED',
        rejection_code: requestedDiscount > maxDiscountAllowed ? 'DISCOUNT_THRESHOLD_EXCEEDED' : 'TRANSACTION_LIMIT_EXCEEDED',
        rejection_reason: requestedDiscount > maxDiscountAllowed 
          ? `Requested discount of ${requestedDiscount}% exceeds merchant maximum policy of ${maxDiscountAllowed}%.`
          : `Requested transaction total ₹${requestedTotal} exceeds merchant maximum transaction limit of ₹${maxTotalAllowed}.`,
        requested_discount: requestedDiscount,
        allowed_max_discount: maxDiscountAllowed,
        requested_total: requestedTotal,
        allowed_max_total: maxTotalAllowed,
        ap2_mandate: null,
        timestamp: new Date().toISOString()
      };
    }
  }
}

async function getAuditLedgerFromGatekeeper() {
  try {
    const response = await fetch(`${process.env.GATEKEEPER_URL || 'http://localhost:8080/api/v1'}/audit`);
    if (!response.ok) throw new Error('Gatekeeper audit error');
    return await response.json();
  } catch (error) {
    return [];
  }
}

module.exports = {
  evaluateTransactionIntent,
  getAuditLedgerFromGatekeeper
};
