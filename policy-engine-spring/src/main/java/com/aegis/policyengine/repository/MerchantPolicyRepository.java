package com.aegis.policyengine.repository;

import com.aegis.policyengine.model.MerchantPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantPolicyRepository extends JpaRepository<MerchantPolicy, String> {
    Optional<MerchantPolicy> findByMerchantId(String merchantId);
}
