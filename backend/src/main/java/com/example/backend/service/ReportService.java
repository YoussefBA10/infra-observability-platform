package com.example.backend.service;

import com.example.backend.dto.ReportRequest;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;

@Service
public class ReportService {

    @Autowired
    private PipelineRepository pipelineRepository;

    @Autowired
    private SonarReportRepository sonarReportRepository;

    @Autowired
    private TrivyFindingRepository trivyFindingRepository;

    @Autowired
    private OwaspFindingRepository owaspFindingRepository;

    @Transactional
    public Pipeline saveReport(ReportRequest request) {
        Pipeline pipeline = new Pipeline();
        pipeline.setTimestamp(LocalDateTime.now());
        pipeline.setStatus(request.getStatus());
        pipeline.setDuration(request.getDuration());
        pipeline.setCommitHash(request.getCommitHash());
        pipeline.setComponent(request.getComponent() != null ? request.getComponent() : "backend");
        pipeline.setAppVersion(request.getAppVersion());
        
        pipeline.setTrivyFindings(new ArrayList<>());
        pipeline.setOwaspFindings(new ArrayList<>());

        if (request.getSonarData() != null) {
            saveSonarData(pipeline, request.getSonarData());
        }

        if (request.getTrivyData() != null) {
            saveTrivyData(pipeline, request.getTrivyData());
        }

        if (request.getOwaspData() != null) {
            saveOwaspData(pipeline, request.getOwaspData());
        }

        return pipelineRepository.save(pipeline);
    }

    private void saveSonarData(Pipeline pipeline, JsonNode sonarData) {
        SonarReport report = new SonarReport();
        JsonNode measures = sonarData.path("component").path("measures");
        for (JsonNode measure : measures) {
            String metric = measure.path("metric").asText();
            String val = measure.path("value").asText();
            switch (metric) {
                case "bugs": report.setBugs(Integer.parseInt(val)); break;
                case "vulnerabilities": report.setVulnerabilities(Integer.parseInt(val)); break;
                case "code_smells": report.setCodeSmells(Integer.parseInt(val)); break;
                // case "coverage": report.setCoverage(Double.parseDouble(val)); break; // Removed coverage
                case "duplicated_lines_density": report.setDuplication(Double.parseDouble(val)); break;
            }
        }
        report.setPipeline(pipeline);
        pipeline.setSonarReport(report);
    }

    private void saveTrivyData(Pipeline pipeline, JsonNode trivyData) {
        JsonNode results = trivyData.path("Results");
        for (JsonNode result : results) {
            JsonNode vulnerabilities = result.path("Vulnerabilities");
            for (JsonNode vuln : vulnerabilities) {
                TrivyFinding finding = new TrivyFinding();
                finding.setCve(vuln.path("VulnerabilityID").asText());
                finding.setPackageName(vuln.path("PkgName").asText());
                finding.setSeverity(normalizeSeverity(vuln.path("Severity").asText()));
                finding.setPipeline(pipeline);
                pipeline.getTrivyFindings().add(finding);
            }
        }
    }

    private void saveOwaspData(Pipeline pipeline, JsonNode owaspData) {
        JsonNode deps = owaspData.path("dependencies");
        for (JsonNode dep : deps) {
            JsonNode vulns = dep.path("vulnerabilities");
            if (vulns.isArray()) {
                for (JsonNode vuln : vulns) {
                    OwaspFinding finding = new OwaspFinding();
                    finding.setDependency(dep.path("fileName").asText());
                    finding.setCvss(vuln.path("cvssv3").path("baseScore").asDouble());
                    finding.setSeverity(normalizeSeverity(vuln.path("cvssv3").path("baseSeverity").asText()));
                    finding.setPipeline(pipeline);
                    pipeline.getOwaspFindings().add(finding);
                }
            }
        }
    }

    public Optional<Pipeline> getLatestReport(String component) {
        if (component != null && !component.isEmpty()) {
            return pipelineRepository.findTopByComponentWithLegacy(component);
        }
        return pipelineRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"))
                .stream()
                .findFirst();
    }

    public List<Pipeline> getReportHistory(String component) {
        if (component != null && !component.isEmpty()) {
            return pipelineRepository.findByComponentWithLegacy(component);
        }
        return pipelineRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    public Optional<Pipeline> getReportById(Long id) {
        return pipelineRepository.findById(id);
    }

    private Integer normalizeSeverity(String severity) {
        if (severity == null) return 1;
        String sev = severity.toUpperCase();
        if (sev.equals("CRITICAL")) return 5;
        if (sev.equals("HIGH")) return 4;
        if (sev.equals("MEDIUM")) return 3;
        if (sev.equals("LOW")) return 2;
        return 1;
    }
}

