package com.civic.grievance.entity;

import com.civic.grievance.entity.enums.Priority;
import com.civic.grievance.entity.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime slaDeadline;
}
