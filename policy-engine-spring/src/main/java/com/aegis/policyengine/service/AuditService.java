package com.aegis.policyengine.service;

import com.aegis.policyengine.model.AuditLedger;
import com.aegis.policyengine.model.PolicyDecision;
import com.aegis.policyengine.repository.AuditLedgerRepository;
import com.aegis.policyengine.util.CryptoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLedgerRepository auditLedgerRepository;

    @Transactional
    public AuditLedger logDecision(PolicyDecision decision) {
        Optional<AuditLedger> lastEntry = auditLedgerRepository.findTopByOrderByTimestampDesc();
        String previousHash = lastEntry.map(AuditLedger::getPayloadHash).orElse("0000000000000000000000000000000000000000000000000000000000000000");

        String payloadToHash = decision.getDecisionId() + ":" +
                decision.getIntentId() + ":" +
                decision.getStatus() + ":" +
                decision.getRequestedDiscountPct() + ":" +
                previousHash;

        String currentHash = CryptoUtils.generateSha256Hash(payloadToHash);

        AuditLedger ledger = AuditLedger.builder()
                .ledgerId("led_" + UUID.randomUUID().toString().substring(0, 8))
                .decisionId(decision.getDecisionId())
                .payloadHash(currentHash)
                .previousHash(previousHash)
                .build();

        return auditLedgerRepository.save(ledger);
    }
}
