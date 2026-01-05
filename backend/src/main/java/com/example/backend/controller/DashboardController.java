package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping
    public Map<String, Object> getDashboardSummary() {
        return Map.of(
                "ciCdStatus", Map.of(
                        "frontend-app", Map.of("status", "building", "lastBuild", "5 mins ago", "buildDuration", "2m 30s"),
                        "backend-api", Map.of("status", "idle", "lastBuild", "1 hour ago", "buildDuration", "1m 15s")
                ),
                "monitoring", Map.of(
                        "prometheus", Map.of("status", "up", "uptime", "99.98%", "alerts", 3),
                        "grafana", Map.of("status", "up", "uptime", "99.99%", "dashboards", 12)
                ),
                "infrastructure", Map.of(
                        "kubernetes", Map.of("status", "healthy", "nodes", 3, "pods", 50),
                        "docker", Map.of("status", "healthy", "containers", 25, "images", 120),
                        "aws", Map.of("status", "warning", "regions", 3, "instances", 15)
                )
        );
    }
}
