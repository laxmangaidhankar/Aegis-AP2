package com.aegis.policyengine.repository;

import com.aegis.policyengine.model.Ap2Mandate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Ap2MandateRepository extends JpaRepository<Ap2Mandate, String> {
    Optional<Ap2Mandate> findByIntentId(String intentId);
}
