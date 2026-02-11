package com.example.backend.service;

import com.example.backend.client.ActuatorClient;
import com.example.backend.client.DockerStatsCollector;
import com.example.backend.client.PrometheusClient;
import com.example.backend.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class InfrastructureService {

    private final PrometheusClient prometheusClient;
    private final ActuatorClient actuatorClient;
    private final DockerStatsCollector dockerStatsCollector;

    @Value("${node.1.ip:192.168.126.131}")
    private String node1Ip;
    @Value("${node.1.name:node-1}")
    private String node1Name;

    @Value("${node.2.ip:192.168.126.132}")
    private String node2Ip;
    @Value("${node.2.name:node-2}")
    private String node2Name;

    @Value("${node.3.ip:192.168.126.130}")
    private String node3Ip;
    @Value("${node.3.name:vmpipe}")
    private String node3Name;

    public InfrastructureService(PrometheusClient prometheusClient, ActuatorClient actuatorClient, DockerStatsCollector dockerStatsCollector) {
        this.prometheusClient = prometheusClient;
        this.actuatorClient = actuatorClient;
        this.dockerStatsCollector = dockerStatsCollector;
    }

    private List<NodeConfig> getNodesConfig() {
        return Arrays.asList(
            new NodeConfig(node1Name, node1Ip),
            new NodeConfig(node2Name, node2Ip),
            new NodeConfig(node3Name, node3Ip)
        );
    }

    public InfrastructureSummaryDTO getSummary() {
        InfrastructureSummaryDTO summary = new InfrastructureSummaryDTO();
        
        int totalRunning = 0;
        int totalStopped = 0;
        double maxCpu = 0;
        double maxMem = 0;
        boolean telemetryDown = false;

        for (NodeConfig node : getNodesConfig()) {
            try {
                totalRunning += prometheusClient.queryActiveContainerCount(); // This should ideally be per node, but current API is global? 
                // Wait, queryActiveContainerCount in PrometheusClient is global (sum by name).
                // Actually, prometheus queries in PrometheusClient are global unless it has {instance="..."}.
                // queryActiveContainerCount is global. I should probably just call it once.
            } catch (Exception e) {}
        }
        
        // Let's use global metrics for summary but per-node for nodes section.
        totalRunning = prometheusClient.queryActiveContainerCount();
        totalStopped = prometheusClient.queryStoppedContainerCount();
        int incidents = prometheusClient.queryTotalAlerts();

        summary.setContainersRunning(totalRunning);
        summary.setServicesRunning(totalRunning); 
        summary.setServicesTotal(totalRunning + totalStopped);
        summary.setIncidentsLast24h(incidents);

        // CPU Usage for summary: take the highest across nodes
        for (NodeConfig node : getNodesConfig()) {
            Double cpu = prometheusClient.queryNodeCpuUsage(node.ip);
            Double mem = prometheusClient.queryNodeMemoryUsage(node.ip);
            if (cpu == null || mem == null) telemetryDown = true;
            if (cpu != null && cpu > maxCpu) maxCpu = cpu;
            if (mem != null && mem > maxMem) maxMem = mem;
        }

        summary.setCpuUsage(maxCpu);

        // Health Rules
        if (totalStopped > 0) {
            summary.setHealth("Critical");
        } else if (maxCpu > 80 || maxMem > 80 || telemetryDown) {
            summary.setHealth("Degraded");
        } else {
            summary.setHealth("Healthy");
        }

        return summary;
    }

    public List<ServiceGroupDTO> getServices() {
        List<ContainerMetricDTO> allContainers = new ArrayList<>();
        for (NodeConfig node : getNodesConfig()) {
            allContainers.addAll(dockerStatsCollector.getAllContainerStats(node.ip, node.name));
        }

        // Deduplicate by name if containers are replicated across nodes, 
        // but usually in Docker Compose they are unique per name or have node prefixes.
        Map<String, List<ContainerMetricDTO>> grouped = allContainers.stream()
                .collect(Collectors.groupingBy(ContainerMetricDTO::getService));

        return grouped.entrySet().stream().map(entry -> {
            ServiceGroupDTO dto = new ServiceGroupDTO();
            dto.setGroup(entry.getKey());
            dto.setServices(entry.getValue().stream().map(ContainerMetricDTO::getName).distinct().collect(Collectors.toList()));
            
            boolean anyDown = entry.getValue().stream().anyMatch(c -> "stopped".equals(c.getStatus()));
            boolean allUp = entry.getValue().stream().allMatch(c -> "running".equals(c.getStatus()));
            
            if (anyDown) dto.setStatus("Critical");
            else if (!allUp) dto.setStatus("Degraded");
            else dto.setStatus("Healthy");
            
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ContainerMetricDTO> getContainers() {
        List<ContainerMetricDTO> allContainers = new ArrayList<>();
        for (NodeConfig node : getNodesConfig()) {
            allContainers.addAll(dockerStatsCollector.getAllContainerStats(node.ip, node.name));
        }
        return allContainers;
    }

    public List<NodeMetricDTO> getNodes() {
        List<NodeMetricDTO> nodes = new ArrayList<>();
        for (NodeConfig config : getNodesConfig()) {
            NodeMetricDTO node = new NodeMetricDTO();
            node.setHostname(config.name);
            
            Double cpu = prometheusClient.queryNodeCpuUsage(config.ip);
            Double mem = prometheusClient.queryNodeMemoryUsage(config.ip);
            Double disk = prometheusClient.queryNodeDiskUsage(config.ip);

            node.setCpuUsage(cpu != null ? String.format("%.1f%%", cpu) : "N/A");
            node.setMemoryUsed(mem != null ? String.format("%.1f%%", mem) : "N/A");
            node.setMemoryTotal("9GB"); 
            node.setDiskUsage(disk != null ? String.format("%.1f%%", disk) : "N/A");
            
            nodes.add(node);
        }
        return nodes;
    }

    public List<String> getRisks() {
        List<String> risks = new ArrayList<>();
        boolean anyTelemetryDown = false;
        int totalStopped = prometheusClient.queryStoppedContainerCount();

        for (NodeConfig node : getNodesConfig()) {
            Double cpu = prometheusClient.queryNodeCpuUsage(node.ip);
            Double mem = prometheusClient.queryNodeMemoryUsage(node.ip);
            Double disk = prometheusClient.queryNodeDiskUsage(node.ip);

            if (cpu == null || mem == null || disk == null) {
                anyTelemetryDown = true;
            } else {
                if (cpu > 75) risks.add("High CPU usage detected on " + node.name);
                if (mem > 75) risks.add("Memory usage above 75% on " + node.name);
                if (disk > 80) risks.add("Disk space approaching 80% on " + node.name);
            }
        }

        if (anyTelemetryDown) {
            risks.add("Telemetry source partially unreachable (Check node-exporter/cAdvisor)");
        }
        if (totalStopped > 0) {
            risks.add(totalStopped + " containers are currently in stopped state across the cluster");
        }

        return risks;
    }

    private static class NodeConfig {
        String name;
        String ip;
        NodeConfig(String name, String ip) {
            this.name = name;
            this.ip = ip;
        }
    }
}
