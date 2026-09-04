package com.aegis.policyengine.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_intents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionIntent {

    @Id
    @Column(name = "intent_id")
    private String intentId;

    @Column(name = "buyer_id", nullable = false)
    private String buyerId;

    @Column(nullable = false)
    private String sku;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "requested_unit_price", nullable = false)
    private Double requestedUnitPrice;

    @Column(name = "requested_total", nullable = false)
    private Double requestedTotal;

    @Column(name = "requested_discount_pct", nullable = false)
    private Double requestedDiscountPct;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
