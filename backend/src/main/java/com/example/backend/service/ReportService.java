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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;

@Service
public class ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

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
        logger.info("Deep parsing SonarQube data: {}", sonarData.toString());
        SonarReport report = new SonarReport();
        
        // 1. Check if this is an Issues Search Report (list of issues)
        JsonNode issues = sonarData.path("issues");
        if (issues.isArray() && !issues.isEmpty()) {
            logger.info("Detected SonarQube Issues Search report with {} issues", issues.size());
            int bugs = 0;
            int vulnerabilities = 0;
            int codeSmells = 0;
            
            for (JsonNode issue : issues) {
                String type = issue.path("type").asText();
                if ("BUG".equalsIgnoreCase(type)) bugs++;
                else if ("VULNERABILITY".equalsIgnoreCase(type)) vulnerabilities++;
                else if ("CODE_SMELL".equalsIgnoreCase(type)) codeSmells++;
            }
            report.setBugs(bugs);
            report.setVulnerabilities(vulnerabilities);
            report.setCodeSmells(codeSmells);
            
            // Note: Issues reports usually don't contain duplication %, 
            // but we'll try to find it via recursive search just in case
        }

        // 2. Try to find measures in standard arrays (root or component)
        JsonNode measures = sonarData.path("measures");
        if (measures.isMissingNode() || !measures.isArray()) {
            measures = sonarData.path("component").path("measures");
        }

        if (measures.isArray()) {
            logger.info("Found measures array with {} items", measures.size());
            for (JsonNode m : measures) {
                String key = m.path("metric").asText().toLowerCase();
                String val = m.path("value").asText();
                applyMetric(report, key, val);
            }
        } 
        
        // 3. Fallback: Recursive search for any lingering metrics
        parseRecursively(sonarData, report);

        report.setPipeline(pipeline);
        pipeline.setSonarReport(report);
        logger.info("Final aggregated report: Bugs={}, CodeSmells={}, Vuls={}, Duplication={}", 
                report.getBugs(), report.getCodeSmells(), report.getVulnerabilities(), report.getDuplication());
    }

    private void parseRecursively(JsonNode node, SonarReport report) {
        if (node.isObject()) {
            node.fields().forEachRemaining(entry -> {
                String key = entry.getKey().toLowerCase();
                if (entry.getValue().isValueNode()) {
                    applyMetric(report, key, entry.getValue().asText());
                } else {
                    parseRecursively(entry.getValue(), report);
                }
            });
        } else if (node.isArray()) {
            for (JsonNode item : node) {
                parseRecursively(item, report);
            }
        }
    }

    private void applyMetric(SonarReport report, String key, String val) {
        if (val == null || val.isEmpty() || val.equals("null")) return;
        
        try {
            if (key.contains("bug")) {
                if (report.getBugs() == null) report.setBugs((int) Double.parseDouble(val));
            } else if (key.contains("vulnerabilit")) {
                if (report.getVulnerabilities() == null) report.setVulnerabilities((int) Double.parseDouble(val));
            } else if (key.contains("code_smell") || key.contains("smell")) {
                if (report.getCodeSmells() == null) report.setCodeSmells((int) Double.parseDouble(val));
            } else if (key.contains("duplication") || key.contains("duplicated_lines")) {
                if (report.getDuplication() == null) report.setDuplication(Double.parseDouble(val));
            } else if (key.contains("coverage")) {
                if (report.getCoverage() == null) report.setCoverage(Double.parseDouble(val));
            }
        } catch (Exception e) {
            logger.debug("Could not parse value '{}' for key '{}'", val, key);
        }
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

