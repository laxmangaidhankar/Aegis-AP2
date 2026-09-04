package com.aegis.policyengine.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_catalog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCatalog {

    @Id
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_price", nullable = false)
    private Double basePrice;

    @Column(nullable = false)
    private String currency;

    @Column(name = "max_negotiable_discount", nullable = false)
    private Double maxNegotiableDiscount;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    private String category;
}
