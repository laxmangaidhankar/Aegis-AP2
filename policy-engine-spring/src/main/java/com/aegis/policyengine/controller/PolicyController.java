package com.aegis.policyengine.controller;

import com.aegis.policyengine.dto.PolicyDto;
import com.aegis.policyengine.model.MerchantPolicy;
import com.aegis.policyengine.repository.MerchantPolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final MerchantPolicyRepository merchantPolicyRepository;

    @GetMapping
    public ResponseEntity<MerchantPolicy> getPolicy(@RequestParam(defaultValue = "mch_razorpay_998") String merchantId) {
        MerchantPolicy policy = merchantPolicyRepository.findByMerchantId(merchantId)
                .orElse(MerchantPolicy.builder()
                        .id("pol_default_001")
                        .merchantId(merchantId)
                        .maxDiscountPercentage(15.0)
                        .maxTransactionValue(100000.0)
                        .allowedCurrency("INR")
                        .maxQuantityPerOrder(20)
                        .build());
        return ResponseEntity.ok(policy);
    }

    @PutMapping
    public ResponseEntity<MerchantPolicy> updatePolicy(@RequestBody PolicyDto dto) {
        String merchantId = dto.getMerchant_id() != null ? dto.getMerchant_id() : "mch_razorpay_998";
        MerchantPolicy policy = merchantPolicyRepository.findByMerchantId(merchantId)
                .orElse(MerchantPolicy.builder()
                        .id("pol_default_001")
                        .merchantId(merchantId)
                        .build());

        if (dto.getMax_discount_percentage() != null) policy.setMaxDiscountPercentage(dto.getMax_discount_percentage());
        if (dto.getMax_transaction_value() != null) policy.setMaxTransactionValue(dto.getMax_transaction_value());
        if (dto.getAllowed_currency() != null) policy.setAllowedCurrency(dto.getAllowed_currency());
        if (dto.getMax_quantity_per_order() != null) policy.setMaxQuantityPerOrder(dto.getMax_quantity_per_order());

        MerchantPolicy saved = merchantPolicyRepository.save(policy);
        return ResponseEntity.ok(saved);
    }
}
