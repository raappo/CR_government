package com.civic.grievance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String action;
    private String details;
    private String actorName;
    private String entityType;
    private Long relatedEntityId;
    private LocalDateTime createdAt;
}