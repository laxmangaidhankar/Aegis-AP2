package com.aegis.policyengine.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "merchant_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantPolicy {

    @Id
    private String id;

    @Column(name = "merchant_id", nullable = false)
    private String merchantId;

    @Column(name = "max_discount_percentage", nullable = false)
    private Double maxDiscountPercentage;

    @Column(name = "max_transaction_value", nullable = false)
    private Double maxTransactionValue;

    @Column(name = "allowed_currency", nullable = false)
    private String allowedCurrency;

    @Column(name = "max_quantity_per_order", nullable = false)
    private Integer maxQuantityPerOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
