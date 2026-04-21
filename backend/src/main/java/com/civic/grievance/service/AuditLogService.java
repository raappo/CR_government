package com.civic.grievance.service;

import com.civic.grievance.dto.AuditLogResponse;
import com.civic.grievance.entity.AuditLog;
import com.civic.grievance.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String action, String details,
                    Long actorId, String actorName,
                    Long relatedEntityId, String entityType) {
        AuditLog entry = AuditLog.builder()
                .action(action)
                .details(details)
                .actorId(actorId)
                .actorName(actorName)
                .relatedEntityId(relatedEntityId)
                .entityType(entityType)
                .build();
        auditLogRepository.save(entry);
    }

    public List<AuditLogResponse> getRecent(int limit) {
        return auditLogRepository
                .findByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private AuditLogResponse mapToResponse(AuditLog a) {
        return AuditLogResponse.builder()
                .id(a.getId())
                .action(a.getAction())
                .details(a.getDetails())
                .actorName(a.getActorName())
                .entityType(a.getEntityType())
                .relatedEntityId(a.getRelatedEntityId())
                .createdAt(a.getCreatedAt())
                .build();
    }
}