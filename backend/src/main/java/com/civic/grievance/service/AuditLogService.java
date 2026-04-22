package com.civic.grievance.service;

import com.civic.grievance.dto.AuditLogResponse;
import com.civic.grievance.entity.AuditLog;
import com.civic.grievance.repository.AuditLogRepository;
import com.civic.grievance.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final ComplaintRepository complaintRepository;

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

    /** Dept-scoped audit: includes DEPARTMENT entries for this dept + COMPLAINT entries for complaints in this dept */
    public List<AuditLogResponse> getByDepartment(Long deptId, int limit) {
        // All complaint IDs belonging to this department
        List<Long> complaintIds = complaintRepository.findByDepartment_Id(deptId)
                .stream().map(c -> c.getId()).toList();

        List<AuditLog> deptLogs   = auditLogRepository.findByEntityTypeAndRelatedEntityIdOrderByCreatedAtDesc("DEPARTMENT", deptId);
        List<AuditLog> cmplLogs   = complaintIds.isEmpty() ? List.of()
                : auditLogRepository.findByEntityTypeAndRelatedEntityIdInOrderByCreatedAtDesc("COMPLAINT", complaintIds);

        return Stream.concat(deptLogs.stream(), cmplLogs.stream())
                .sorted(Comparator.comparing(AuditLog::getCreatedAt).reversed())
                .limit(limit)
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