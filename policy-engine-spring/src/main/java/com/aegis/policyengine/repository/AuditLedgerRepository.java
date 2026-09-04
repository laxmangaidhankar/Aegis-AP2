package com.aegis.policyengine.repository;

import com.aegis.policyengine.model.AuditLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuditLedgerRepository extends JpaRepository<AuditLedger, String> {
    Optional<AuditLedger> findTopByOrderByTimestampDesc();
}
