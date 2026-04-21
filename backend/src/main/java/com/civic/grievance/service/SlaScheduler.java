package com.civic.grievance.service;

import com.civic.grievance.entity.Complaint;
import com.civic.grievance.entity.enums.Status;
import com.civic.grievance.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlaScheduler {

    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    /**
     * Runs every hour. Finds unresolved complaints past SLA deadline
     * and sends notifications to the assigned officer and the citizen.
     */
    @Scheduled(fixedRate = 3_600_000) // every 1 hour
    public void checkSlaBreaches() {
        LocalDateTime now = LocalDateTime.now();

        List<Complaint> breached = complaintRepository.findAll().stream()
            .filter(c -> c.getSlaDeadline() != null
                      && c.getSlaDeadline().isBefore(now)
                      && c.getStatus() != Status.RESOLVED
                      && c.getStatus() != Status.CLOSED)
            .toList();

        for (Complaint c : breached) {
            // Notify citizen
            notificationService.notifyUser(
                c.getCitizen(),
                "SLA Breach Alert",
                "Your complaint GRV-" + c.getId() + " (" + c.getTitle() + ") has breached its SLA deadline.",
                c.getId()
            );

            // Notify assigned officer (if any)
            if (c.getAssignedOfficer() != null) {
                notificationService.notifyUser(
                    c.getAssignedOfficer(),
                    "SLA Breach: Action Required",
                    "Complaint GRV-" + c.getId() + " (" + c.getTitle() + ") has breached SLA. Immediate action required.",
                    c.getId()
                );
                emailService.sendEmail(
                    c.getAssignedOfficer().getEmail(),
                    "URGENT: SLA Breach — GRV-" + c.getId(),
                    "Complaint GRV-" + c.getId() + " has breached its SLA deadline. Please update immediately."
                );
            }
        }

        if (!breached.isEmpty()) {
            log.warn("SLA check: {} complaint(s) are past deadline.", breached.size());
        }
    }
}