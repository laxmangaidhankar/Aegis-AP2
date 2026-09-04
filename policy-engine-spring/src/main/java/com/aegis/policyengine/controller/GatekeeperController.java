package com.aegis.policyengine.controller;

import com.aegis.policyengine.dto.EvaluationResponseDto;
import com.aegis.policyengine.dto.TransactionIntentDto;
import com.aegis.policyengine.service.PolicyEvaluatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/gatekeeper")
@RequiredArgsConstructor
public class GatekeeperController {

    private final PolicyEvaluatorService policyEvaluatorService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "component", "Spring Boot Policy Engine Gatekeeper",
                "mode", "DETERMINISTIC_FINANCIAL_AUTHORIZER",
                "razorpay_isolated", true
        ));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<EvaluationResponseDto> evaluateIntent(@RequestBody TransactionIntentDto intentDto) {
        EvaluationResponseDto response = policyEvaluatorService.evaluateIntent(intentDto);
        return ResponseEntity.ok(response);
    }
}
