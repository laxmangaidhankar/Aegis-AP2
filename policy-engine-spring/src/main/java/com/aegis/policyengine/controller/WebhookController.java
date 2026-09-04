package com.aegis.policyengine.controller;

import com.aegis.policyengine.model.Ap2Mandate;
import com.aegis.policyengine.repository.Ap2MandateRepository;
import com.aegis.policyengine.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final RazorpayService razorpayService;
    private final Ap2MandateRepository ap2MandateRepository;

    @PostMapping("/razorpay")
    public ResponseEntity<Map<String, Object>> handleRazorpayWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestParam(required = false) String mandateId) {

        // Validate webhook signature if provided
        if (signature != null && !razorpayService.verifyWebhookSignature(rawPayload, signature)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "status", "FAILED",
                    "reason", "INVALID_WEBHOOK_SIGNATURE"
            ));
        }

        if (mandateId != null) {
            Optional<Ap2Mandate> mandateOpt = ap2MandateRepository.findById(mandateId);
            if (mandateOpt.isPresent()) {
                Ap2Mandate mandate = mandateOpt.get();
                mandate.setStatus("PAID");
                ap2MandateRepository.save(mandate);
            }
        }

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "event", "payment.captured",
                "acknowledged", true
        ));
    }
}
