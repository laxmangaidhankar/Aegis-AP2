package com.aegis.policyengine.service;

import com.aegis.policyengine.util.CryptoUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RazorpayService {

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    public String generatePaymentLink(String mandateId, double amount, String currency) {
        // Generates deterministic Razorpay payment link URL for AP2 authorization
        String linkId = "pay_" + UUID.randomUUID().toString().substring(0, 12);
        return "https://rzp.io/l/" + linkId + "?mandate=" + mandateId + "&amount=" + amount + "&currency=" + currency;
    }

    public boolean verifyWebhookSignature(String payload, String signature) {
        if (signature == null || signature.isEmpty()) {
            return false;
        }
        String expectedSignature = CryptoUtils.generateHmacSha256(payload, razorpayKeySecret);
        return expectedSignature.equals(signature);
    }
}
