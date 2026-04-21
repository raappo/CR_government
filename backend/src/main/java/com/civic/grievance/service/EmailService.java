package com.civic.grievance.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Send a plain-text email asynchronously.
     * If mail is not configured, this logs a warning and returns gracefully.
     */
    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@civicconnect.kar.gov.in");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {} | Subject: {}", to, subject);
        } catch (Exception e) {
            // Mail not configured — log only, do not crash the application
            log.warn("Email sending skipped (mail not configured): {} | {}", to, e.getMessage());
        }
    }

    public void sendComplaintSubmitted(String to, String name, long complaintId, String title) {
        String body = String.format(
            "Dear %s,\n\nYour complaint has been successfully submitted.\n\n" +
            "Complaint ID : GRV-%d\nTitle        : %s\n\n" +
            "You can track your complaint status at: http://localhost:4200/citizen/complaint-history\n\n" +
            "Regards,\nCivicConnect Team\nGovernment of Karnataka",
            name, complaintId, title
        );
        sendEmail(to, "CivicConnect: Complaint Submitted — GRV-" + complaintId, body);
    }

    public void sendStatusUpdate(String to, String name, long complaintId, String title, String status) {
        String body = String.format(
            "Dear %s,\n\nYour complaint GRV-%d (%s) has been updated.\n\nNew Status: %s\n\n" +
            "Track your complaint: http://localhost:4200/citizen/complaint-history\n\n" +
            "Regards,\nCivicConnect Team",
            name, complaintId, title, status
        );
        sendEmail(to, "CivicConnect: Complaint Status Updated — GRV-" + complaintId, body);
    }

    public void sendOfficerAssigned(String to, String officerName, long complaintId, String title) {
        String body = String.format(
            "Dear Officer %s,\n\nA new complaint has been assigned to you.\n\n" +
            "Complaint ID : GRV-%d\nTitle        : %s\n\n" +
            "Log in to your dashboard: http://localhost:4200/officer/assigned-complaints\n\n" +
            "Regards,\nCivicConnect Admin",
            officerName, complaintId, title
        );
        sendEmail(to, "CivicConnect: New Complaint Assigned — GRV-" + complaintId, body);
    }
}