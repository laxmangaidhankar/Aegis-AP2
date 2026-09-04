package com.aegis.policyengine.repository;

import com.aegis.policyengine.model.TransactionIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionIntentRepository extends JpaRepository<TransactionIntent, String> {
}
