package com.civic.grievance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;       // e.g. COMPLAINT_CREATED, STATUS_CHANGED, OFFICER_ASSIGNED

    @Column(length = 500)
    private String details;      // human-readable description

    private Long actorId;        // user who performed the action
    private String actorName;

    private Long relatedEntityId; // complaint id, user id, etc.
    private String entityType;    // COMPLAINT, USER, DEPARTMENT

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}