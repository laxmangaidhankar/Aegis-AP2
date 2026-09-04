package com.aegis.policyengine.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ap2_mandates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ap2Mandate {

    @Id
    @Column(name = "mandate_id")
    private String mandateId;

    @Column(name = "intent_id", nullable = false)
    private String intentId;

    @Column(name = "merchant_id", nullable = false)
    private String merchantId;

    @Column(name = "authorized_amount", nullable = false)
    private Double authorizedAmount;

    @Column(nullable = false)
    private String currency;

    @Column(name = "cryptographic_signature", columnDefinition = "TEXT", nullable = false)
    private String cryptographicSignature;

    @Column(name = "payment_link", columnDefinition = "TEXT", nullable = false)
    private String paymentLink;

    @Column(nullable = false)
    private String status; // ISSUED, PAID, EXPIRED, CANCELLED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
