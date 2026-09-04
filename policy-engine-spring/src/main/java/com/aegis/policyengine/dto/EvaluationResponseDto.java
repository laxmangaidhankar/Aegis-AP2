package com.aegis.policyengine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponseDto {
    private String decision_id;
    private String intent_id;
    private String status; // APPROVED or POLICY_VIOLATION_REJECTED
    private String rejection_code;
    private String rejection_reason;
    private Double requested_discount;
    private Double allowed_max_discount;
    private Double requested_total;
    private Double allowed_max_total;
    private Ap2MandateDto ap2_mandate;
    private LocalDateTime timestamp;
}
