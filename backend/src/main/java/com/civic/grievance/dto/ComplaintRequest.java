package com.civic.grievance.dto;

import com.civic.grievance.entity.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Citizen id is required")
    private Long citizenId;

    private Long assignedOfficerId;

    private Double latitude;

    private Double longitude;
}
