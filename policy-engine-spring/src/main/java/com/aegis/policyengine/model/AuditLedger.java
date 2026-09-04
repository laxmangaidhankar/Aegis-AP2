package com.aegis.policyengine.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLedger {

    @Id
    @Column(name = "ledger_id")
    private String ledgerId;

    @Column(name = "decision_id", nullable = false)
    private String decisionId;

    @Column(name = "payload_hash", nullable = false)
    private String payloadHash;

    @Column(name = "previous_hash")
    private String previousHash;

    private LocalDateTime timestamp;

    @PrePersist
    public void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
