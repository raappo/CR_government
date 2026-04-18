package com.civic.grievance.service;

import com.civic.grievance.dto.ComplaintRequest;
import com.civic.grievance.dto.ComplaintResponse;
import com.civic.grievance.entity.Complaint;
import com.civic.grievance.entity.User;
import com.civic.grievance.entity.enums.Priority;
import com.civic.grievance.entity.enums.Role;
import com.civic.grievance.entity.enums.Status;
import com.civic.grievance.exception.BadRequestException;
import com.civic.grievance.exception.ResourceNotFoundException;
import com.civic.grievance.repository.ComplaintRepository;
import com.civic.grievance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintResponse createComplaint(ComplaintRequest request) {
        User citizen = userRepository.findById(request.getCitizenId())
                .orElseThrow(() -> new ResourceNotFoundException("Citizen not found with id: " + request.getCitizenId()));

        if (citizen.getRole() != Role.CITIZEN) {
            throw new BadRequestException("Complaint creator must have CITIZEN role");
        }

        User assignedOfficer = null;
        if (request.getAssignedOfficerId() != null) {
            assignedOfficer = userRepository.findById(request.getAssignedOfficerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned officer not found with id: " + request.getAssignedOfficerId()));

            if (assignedOfficer.getRole() != Role.OFFICER && assignedOfficer.getRole() != Role.SUPERVISOR) {
                throw new BadRequestException("Assigned user must have OFFICER or SUPERVISOR role");
            }
        }

        LocalDateTime createdAt = LocalDateTime.now();

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() == null ? Priority.MEDIUM : request.getPriority())
                .status(Status.PENDING)
                .citizen(citizen)
                .assignedOfficer(assignedOfficer)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .createdAt(createdAt)
                .slaDeadline(createdAt.plusHours(24))
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);
        return mapToResponse(savedComplaint);
    }

    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        User assignedOfficer = complaint.getAssignedOfficer();

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .status(complaint.getStatus())
                .priority(complaint.getPriority())
                .citizenId(complaint.getCitizen().getId())
                .citizenName(complaint.getCitizen().getName())
                .assignedOfficerId(assignedOfficer != null ? assignedOfficer.getId() : null)
                .assignedOfficerName(assignedOfficer != null ? assignedOfficer.getName() : null)
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .createdAt(complaint.getCreatedAt())
                .slaDeadline(complaint.getSlaDeadline())
                .build();
    }
}
