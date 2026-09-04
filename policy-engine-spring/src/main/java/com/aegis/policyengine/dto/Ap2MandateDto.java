package com.aegis.policyengine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ap2MandateDto {
    @JsonProperty("@context")
    private String context;
    private String type; // e.g. CartMandate
    private String mandate_id;
    private String merchant_id;
    private Double authorized_amount;
    private String currency;
    private String signature;
    private String payment_link;
    private String status;
}
