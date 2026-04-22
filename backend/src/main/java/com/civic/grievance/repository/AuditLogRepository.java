package com.civic.grievance.repository;

import com.civic.grievance.entity.AuditLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByOrderByCreatedAtDesc(Pageable pageable);
    List<AuditLog> findByEntityTypeOrderByCreatedAtDesc(String entityType, Pageable pageable);
    List<AuditLog> findByEntityTypeAndRelatedEntityIdOrderByCreatedAtDesc(String entityType, Long relatedEntityId);
    List<AuditLog> findByEntityTypeAndRelatedEntityIdInOrderByCreatedAtDesc(String entityType, List<Long> relatedEntityIds);
}