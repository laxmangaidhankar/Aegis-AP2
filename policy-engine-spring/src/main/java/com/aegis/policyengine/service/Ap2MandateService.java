package com.aegis.policyengine.service;

import com.aegis.policyengine.dto.Ap2MandateDto;
import com.aegis.policyengine.model.Ap2Mandate;
import com.aegis.policyengine.repository.Ap2MandateRepository;
import com.aegis.policyengine.util.CryptoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class Ap2MandateService {

    private final Ap2MandateRepository ap2MandateRepository;
    private final RazorpayService razorpayService;

    @Value("${ap2.secret-key}")
    private String ap2SecretKey;

    public Ap2MandateDto createAndSignMandate(String intentId, String merchantId, double amount, String currency) {
        String mandateId = "mandate_ap2_" + UUID.randomUUID().toString().substring(0, 10);
        String paymentLink = razorpayService.generatePaymentLink(mandateId, amount, currency);

        // Standard AP2 CartMandate Canonical Representation
        String canonicalPayload = String.format("ap2:mandate:%s:merchant:%s:amount:%.2f:currency:%s",
                mandateId, merchantId, amount, currency);

        String signature = CryptoUtils.generateHmacSha256(canonicalPayload, ap2SecretKey);

        Ap2Mandate mandate = Ap2Mandate.builder()
                .mandateId(mandateId)
                .intentId(intentId)
                .merchantId(merchantId)
                .authorizedAmount(amount)
                .currency(currency)
                .cryptographicSignature(signature)
                .paymentLink(paymentLink)
                .status("ISSUED")
                .build();

        ap2MandateRepository.save(mandate);

        return Ap2MandateDto.builder()
                .context("https://ap2.dev/schema")
                .type("CartMandate")
                .mandate_id(mandateId)
                .merchant_id(merchantId)
                .authorized_amount(amount)
                .currency(currency)
                .signature(signature)
                .payment_link(paymentLink)
                .status("ISSUED")
                .build();
    }
}
