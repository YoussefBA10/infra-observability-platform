package com.example.backend.controller;

import com.example.backend.dto.ReportRequest;
import com.example.backend.entity.Pipeline;
import com.example.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<Pipeline> createReport(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "duration", required = false) Long duration,
            @RequestParam(value = "commitHash", required = false) String commitHash,
            @RequestParam(value = "app", required = false) String app,
            @RequestParam(value = "appversion", required = false) String appVersion,
            @RequestParam(value = "sonar", required = false) org.springframework.web.multipart.MultipartFile sonarFile,
            @RequestParam(value = "trivy", required = false) org.springframework.web.multipart.MultipartFile trivyFile,
            @RequestParam(value = "owasp", required = false) org.springframework.web.multipart.MultipartFile owaspFile
    ) throws java.io.IOException {
        ReportRequest request = new ReportRequest();
        request.setStatus(status);
        request.setDuration(duration);
        request.setCommitHash(commitHash);
        request.setComponent(app);
        request.setAppVersion(appVersion);

        if (sonarFile != null) {
            request.setSonarData(objectMapper.readTree(sonarFile.getBytes()));
        }
        if (trivyFile != null) {
            request.setTrivyData(objectMapper.readTree(trivyFile.getBytes()));
        }
        if (owaspFile != null) {
            request.setOwaspData(objectMapper.readTree(owaspFile.getBytes()));
        }

        Pipeline pipeline = reportService.saveReport(request);
        return ResponseEntity.ok(pipeline);
    }

    @GetMapping("/latest")
    public ResponseEntity<Pipeline> getLatestReport(@RequestParam(required = false) String component) {
        return reportService.getLatestReport(component)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/sonar")
    public ResponseEntity<com.example.backend.entity.SonarReport> getSonarReport(@PathVariable Long id) {
        return reportService.getReportById(id)
                .map(p -> ResponseEntity.ok(p.getSonarReport()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/trivy")
    public ResponseEntity<List<com.example.backend.entity.TrivyFinding>> getTrivyFindings(@PathVariable Long id) {
        return reportService.getReportById(id)
                .map(p -> ResponseEntity.ok(p.getTrivyFindings()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/owasp")
    public ResponseEntity<List<com.example.backend.entity.OwaspFinding>> getOwaspFindings(@PathVariable Long id) {
        return reportService.getReportById(id)
                .map(p -> ResponseEntity.ok(p.getOwaspFindings()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/history")
    public ResponseEntity<List<Pipeline>> getReportHistory(@RequestParam(required = false) String component) {
        return ResponseEntity.ok(reportService.getReportHistory(component));
    }
}
