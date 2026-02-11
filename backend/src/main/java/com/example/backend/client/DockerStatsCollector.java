package com.example.backend.client;

import com.example.backend.dto.ContainerMetricDTO;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class DockerStatsCollector {

    private final PrometheusClient prometheusClient;

    public DockerStatsCollector(PrometheusClient prometheusClient) {
        this.prometheusClient = prometheusClient;
    }

    public List<ContainerMetricDTO> getAllContainerStats(String nodeIp, String nodeName) {
        // Query Prometheus for container data
        List<Map<String, Object>> cpuMetrics = prometheusClient.queryTopContainersCpu(nodeIp);
        List<Map<String, Object>> memMetrics = prometheusClient.queryTopContainersMemory(nodeIp);
        List<Map<String, Object>> startTimes = prometheusClient.queryContainerStartTimes(nodeIp);
        List<String> activeNames = prometheusClient.queryActiveContainerList(nodeIp);

        // 1. Get all unique container names from metrics and active list
        List<String> allNames = new ArrayList<>(activeNames);
        cpuMetrics.forEach(m -> {
            String name = (String) m.get("name");
            if (name != null && !allNames.contains(name)) allNames.add(name);
        });

        // 2. Build DTOs
        return allNames.stream()
                .filter(name -> !name.equals("cadvisor") && !name.equals("Unknown"))
                .map(name -> {
                    ContainerMetricDTO dto = new ContainerMetricDTO();
                    dto.setName(name);
                    dto.setNode(nodeName);
                    dto.setService(mapToServiceGroup(name));
                    dto.setStatus(activeNames.contains(name) ? "running" : "stopped");
                    
                    // CPU usage
                    Double cpu = findValue(cpuMetrics, name);
                    dto.setCpu(cpu != null ? String.format("%.2f%%", cpu * 100) : "0.00%");
                    
                    // Memory usage
                    Double mem = findValue(memMetrics, name);
                    dto.setMemory(mem != null ? String.format("%.0f MB", mem / 1024 / 1024) : "0 MB");
                    
                    // Uptime calculation
                    Double startTime = findValue(startTimes, name);
                    dto.setUptime(calculateUptime(startTime));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private String calculateUptime(Double startTimeSeconds) {
        if (startTimeSeconds == null || startTimeSeconds <= 0) return "N/A";
        long uptimeSeconds = (System.currentTimeMillis() / 1000) - startTimeSeconds.longValue();
        if (uptimeSeconds < 60) return uptimeSeconds + "s";
        long minutes = uptimeSeconds / 60;
        if (minutes < 60) return minutes + "m";
        long hours = minutes / 60;
        if (hours < 24) return hours + "h";
        return (hours / 24) + "d";
    }

    private String mapToServiceGroup(String name) {
        String lower = name.toLowerCase();
        if (lower.contains("jenkins") || lower.contains("sonar")) return "CI/CD";
        if (lower.contains("grafana") || lower.contains("prometheus") || lower.contains("cadvisor") || lower.contains("node-exporter")) return "Monitoring";
        if (lower.contains("backend") || lower.contains("frontend") || lower.contains("mysql") || lower.contains("nginx")) return "Core Platform";
        if (lower.contains("trivy") || lower.contains("dependency-check")) return "Security";
        return "Core Platform"; // Default
    }

    private Double findValue(List<Map<String, Object>> metrics, String name) {
        return metrics.stream()
                .filter(m -> name.equals(m.get("name")))
                .map(m -> (Double) m.get("value"))
                .findFirst()
                .orElse(null);
    }
}
