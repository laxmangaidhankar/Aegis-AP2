package com.aegis.policyengine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionIntentDto {
    private String intent_id;
    private String buyer_id;
    private String action; // e.g. REQUEST_CHECKOUT
    private String sku;
    private Integer qty;
    private Double unit_price;
    private Double negotiated_total;
    private Double discount_applied;
    private String justification;
    private String merchant_id;
}
