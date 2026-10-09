package com.shopsphere.ai.repository;

import com.shopsphere.ai.entity.AiAgentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiAgentLogRepository extends JpaRepository<AiAgentLog, String> {
    List<AiAgentLog> findTop20ByOrderByCreatedAtDesc();
    List<AiAgentLog> findByAgentTypeOrderByCreatedAtDesc(String agentType);
    List<AiAgentLog> findBySessionIdOrderByCreatedAtAsc(String sessionId);
    long countByAgentType(String agentType);
}
