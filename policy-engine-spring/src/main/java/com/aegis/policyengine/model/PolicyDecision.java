package com.aegis.policyengine.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "policy_decisions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyDecision {

    @Id
    @Column(name = "decision_id")
    private String decisionId;

    @Column(name = "intent_id", nullable = false)
    private String intentId;

    @Column(name = "buyer_id", nullable = false)
    private String buyerId;

    @Column(nullable = false)
    private String status; // APPROVED, POLICY_VIOLATION_REJECTED

    @Column(name = "rejection_code")
    private String rejectionCode;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "requested_discount_pct")
    private Double requestedDiscountPct;

    @Column(name = "allowed_max_discount_pct")
    private Double allowedMaxDiscountPct;

    @Column(name = "requested_total")
    private Double requestedTotal;

    @Column(name = "allowed_max_total")
    private Double allowedMaxTotal;

    @Column(name = "eval_timestamp")
    private LocalDateTime evalTimestamp;

    @PrePersist
    public void onCreate() {
        this.evalTimestamp = LocalDateTime.now();
    }
}
