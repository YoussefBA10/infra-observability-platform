package com.example.backend.repository;

import com.example.backend.entity.SonarReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SonarReportRepository extends JpaRepository<SonarReport, Long> {
}
