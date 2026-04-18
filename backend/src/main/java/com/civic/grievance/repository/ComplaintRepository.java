package com.civic.grievance.repository;

import com.civic.grievance.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
}
