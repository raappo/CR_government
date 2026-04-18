package com.civic.grievance.controller;

import com.civic.grievance.dto.ComplaintRequest;
import com.civic.grievance.dto.ComplaintResponse;
import com.civic.grievance.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.createComplaint(request));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }
}
