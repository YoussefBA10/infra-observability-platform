package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.InfrastructureService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/infrastructure")
public class InfrastructureController {

    private final InfrastructureService infrastructureService;

    public InfrastructureController(InfrastructureService infrastructureService) {
        this.infrastructureService = infrastructureService;
    }

    @GetMapping("/summary")
    public InfrastructureSummaryDTO getSummary() {
        return infrastructureService.getSummary();
    }

    @GetMapping("/services")
    public List<ServiceGroupDTO> getServices() {
        return infrastructureService.getServices();
    }

    @GetMapping("/containers")
    public List<ContainerMetricDTO> getContainers() {
        return infrastructureService.getContainers();
    }

    @GetMapping("/nodes")
    public List<NodeMetricDTO> getNodes() {
        return infrastructureService.getNodes();
    }

    @GetMapping("/risks")
    public List<String> getRisks() {
        return infrastructureService.getRisks();
    }
}
