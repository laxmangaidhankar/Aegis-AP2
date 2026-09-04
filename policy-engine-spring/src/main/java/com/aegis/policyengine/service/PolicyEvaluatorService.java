package com.aegis.policyengine.service;

import com.aegis.policyengine.dto.Ap2MandateDto;
import com.aegis.policyengine.dto.EvaluationResponseDto;
import com.aegis.policyengine.dto.TransactionIntentDto;
import com.aegis.policyengine.model.*;
import com.aegis.policyengine.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PolicyEvaluatorService {

    private final MerchantPolicyRepository merchantPolicyRepository;
    private final ProductCatalogRepository productCatalogRepository;
    private final TransactionIntentRepository transactionIntentRepository;
    private final PolicyDecisionRepository policyDecisionRepository;
    private final AuditService auditService;
    private final Ap2MandateService ap2MandateService;

    @Transactional
    public EvaluationResponseDto evaluateIntent(TransactionIntentDto dto) {
        String intentId = dto.getIntent_id() != null ? dto.getIntent_id() : "int_" + UUID.randomUUID().toString().substring(0, 8);
        String merchantId = dto.getMerchant_id() != null ? dto.getMerchant_id() : "mch_razorpay_998";

        // 1. Fetch Merchant Policy from PostgreSQL
        MerchantPolicy policy = merchantPolicyRepository.findByMerchantId(merchantId)
                .orElse(MerchantPolicy.builder()
                        .id("pol_default_001")
                        .merchantId(merchantId)
                        .maxDiscountPercentage(15.0)
                        .maxTransactionValue(100000.0)
                        .allowedCurrency("INR")
                        .maxQuantityPerOrder(20)
                        .build());

        // 2. Fetch Product from PostgreSQL Catalog
        Optional<ProductCatalog> productOpt = productCatalogRepository.findById(dto.getSku());
        double baseUnitPrice = productOpt.map(ProductCatalog::getBasePrice).orElse(dto.getUnit_price() != null ? dto.getUnit_price() : 500.0);
        double maxProductDiscount = productOpt.map(ProductCatalog::getMaxNegotiableDiscount).orElse(policy.getMaxDiscountPercentage());

        // Calculate requested values
        int qty = dto.getQty() != null ? dto.getQty() : 1;
        double requestedTotal = dto.getNegotiated_total() != null ? dto.getNegotiated_total() : (baseUnitPrice * qty);
        double fullCatalogTotal = baseUnitPrice * qty;
        
        double requestedDiscountPct = dto.getDiscount_applied() != null ? dto.getDiscount_applied() :
                (fullCatalogTotal > 0 ? ((fullCatalogTotal - requestedTotal) / fullCatalogTotal) * 100.0 : 0.0);

        // Record Intent in PostgreSQL
        TransactionIntent intent = TransactionIntent.builder()
                .intentId(intentId)
                .buyerId(dto.getBuyer_id() != null ? dto.getBuyer_id() : "agent_buyer_anon")
                .sku(dto.getSku())
                .quantity(qty)
                .requestedUnitPrice(requestedTotal / qty)
                .requestedTotal(requestedTotal)
                .requestedDiscountPct(requestedDiscountPct)
                .justification(dto.getJustification())
                .build();
        transactionIntentRepository.save(intent);

        // 3. Deterministic Financial Guardrail Check
        double effectiveMaxDiscount = Math.min(policy.getMaxDiscountPercentage(), maxProductDiscount);

        boolean isDiscountValid = requestedDiscountPct <= effectiveMaxDiscount + 0.001;
        boolean isTotalValid = requestedTotal <= policy.getMaxTransactionValue();
        boolean isQtyValid = qty <= policy.getMaxQuantityPerOrder();

        String decisionId = "dec_" + UUID.randomUUID().toString().substring(0, 8);
        PolicyDecision decision;
        Ap2MandateDto ap2Mandate = null;

        if (isDiscountValid && isTotalValid && isQtyValid) {
            // APPROVED
            decision = PolicyDecision.builder()
                    .decisionId(decisionId)
                    .intentId(intentId)
                    .buyerId(intent.getBuyerId())
                    .status("APPROVED")
                    .requestedDiscountPct(requestedDiscountPct)
                    .allowedMaxDiscountPct(effectiveMaxDiscount)
                    .requestedTotal(requestedTotal)
                    .allowedMaxTotal(policy.getMaxTransactionValue())
                    .build();

            policyDecisionRepository.save(decision);
            auditService.logDecision(decision);

            // Issue Signed AP2 Cart Mandate
            ap2Mandate = ap2MandateService.createAndSignMandate(intentId, merchantId, requestedTotal, policy.getAllowedCurrency());

            return EvaluationResponseDto.builder()
                    .decision_id(decisionId)
                    .intent_id(intentId)
                    .status("APPROVED")
                    .requested_discount(requestedDiscountPct)
                    .allowed_max_discount(effectiveMaxDiscount)
                    .requested_total(requestedTotal)
                    .allowed_max_total(policy.getMaxTransactionValue())
                    .ap2_mandate(ap2Mandate)
                    .build();

        } else {
            // POLICY_VIOLATION_REJECTED
            String rejectionCode;
            String rejectionReason;

            if (!isDiscountValid) {
                rejectionCode = "DISCOUNT_THRESHOLD_EXCEEDED";
                rejectionReason = String.format("Requested discount of %.2f%% exceeds merchant maximum policy of %.2f%%.",
                        requestedDiscountPct, effectiveMaxDiscount);
            } else if (!isTotalValid) {
                rejectionCode = "TRANSACTION_LIMIT_EXCEEDED";
                rejectionReason = String.format("Requested transaction amount ₹%.2f exceeds maximum permitted transaction limit of ₹%.2f.",
                        requestedTotal, policy.getMaxTransactionValue());
            } else {
                rejectionCode = "QUANTITY_LIMIT_EXCEEDED";
                rejectionReason = String.format("Requested quantity of %d exceeds maximum order limit of %d units.",
                        qty, policy.getMaxQuantityPerOrder());
            }

            decision = PolicyDecision.builder()
                    .decisionId(decisionId)
                    .intentId(intentId)
                    .buyerId(intent.getBuyerId())
                    .status("POLICY_VIOLATION_REJECTED")
                    .rejectionCode(rejectionCode)
                    .rejectionReason(rejectionReason)
                    .requestedDiscountPct(requestedDiscountPct)
                    .allowedMaxDiscountPct(effectiveMaxDiscount)
                    .requestedTotal(requestedTotal)
                    .allowedMaxTotal(policy.getMaxTransactionValue())
                    .build();

            policyDecisionRepository.save(decision);
            auditService.logDecision(decision);

            return EvaluationResponseDto.builder()
                    .decision_id(decisionId)
                    .intent_id(intentId)
                    .status("POLICY_VIOLATION_REJECTED")
                    .rejection_code(rejectionCode)
                    .rejection_reason(rejectionReason)
                    .requested_discount(requestedDiscountPct)
                    .allowed_max_discount(effectiveMaxDiscount)
                    .requested_total(requestedTotal)
                    .allowed_max_total(policy.getMaxTransactionValue())
                    .ap2_mandate(null)
                    .build();
        }
    }
}
