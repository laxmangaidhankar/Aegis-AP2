package com.aegis.policyengine.repository;

import com.aegis.policyengine.model.PolicyDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyDecisionRepository extends JpaRepository<PolicyDecision, String> {
    List<PolicyDecision> findAllByOrderByEvalTimestampDesc();
}
