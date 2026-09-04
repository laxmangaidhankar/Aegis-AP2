package com.aegis.policyengine.controller;

import com.aegis.policyengine.model.PolicyDecision;
import com.aegis.policyengine.repository.PolicyDecisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final PolicyDecisionRepository policyDecisionRepository;

    @GetMapping
    public ResponseEntity<List<PolicyDecision>> getAuditLedger() {
        return ResponseEntity.ok(policyDecisionRepository.findAllByOrderByEvalTimestampDesc());
    }
}
