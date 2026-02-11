package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import com.example.backend.service.InfraService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final InfraService infraService;

    public DashboardController(InfraService infraService) {
        this.infraService = infraService;
    }

    @GetMapping
    public Map<String, Object> getDashboardSummary() {
        return Map.of(
                "platformHealth", Map.of(
                        "productionApp", infraService.getProductionHealth(),
                        "backendApi", infraService.getBackendHealth(),
                        "monitoringStack", "operational",
                        "infrastructure", infraService.getInfrastructureHealth()
                ),
                "weeklyKpis", Map.of(
                        "deploymentSuccessRate", infraService.getDynamicDeliverySuccess(),
                        "incidents", infraService.getIncidentCount(),
                        "mttr", "12 mins",
                        "availability", infraService.getDynamicAvailability()
                ),
                "deliveryStatus", Map.of(
                        "frontendService", infraService.getFrontendServiceStatus(),
                        "backendService", infraService.getBackendServiceStatus()
                ),
                "capacity", Map.of(
                        "activeServices", infraService.getActiveContainerCount(),
                        "stoppedServices", infraService.getStoppedContainerCount(),
                        "activeContainerNames", infraService.getActiveContainerNames(),
                        "status", infraService.getCapacityStatus()
                )
        );
    }

    @GetMapping("/cicd")
    public Map<String, Object> getCICDStatus() {
        return infraService.getCICDSummary();
    }
}
