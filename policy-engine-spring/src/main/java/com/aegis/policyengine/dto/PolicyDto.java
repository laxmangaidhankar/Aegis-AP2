package com.aegis.policyengine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyDto {
    private String id;
    private String merchant_id;
    private Double max_discount_percentage;
    private Double max_transaction_value;
    private String allowed_currency;
    private Integer max_quantity_per_order;
}
