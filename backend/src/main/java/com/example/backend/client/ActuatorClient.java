package com.example.backend.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;

/**
 * Client for querying Spring Boot Actuator health endpoints.
 */
@Component
public class ActuatorClient {

    private static final Logger logger = LoggerFactory.getLogger(ActuatorClient.class);

    @Value("${server.port:8880}")
    private String serverPort;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Query the local actuator health endpoint.
     * Returns a structured health summary.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getHealthStatus() {
        try {
            // Query the management port (9001) for actuator endpoints
            String url = "http://localhost:9001/actuator/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            logger.warn("Failed to fetch actuator health: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Get a human-readable health summary.
     */
    public String getHealthSummary() {
        Map<String, Object> health = getHealthStatus();
        if (health == null) {
            return null;
        }

        String status = (String) health.get("status");
        StringBuilder summary = new StringBuilder();
        summary.append("Backend Service: ").append(status).append("\n");

        // Parse components if available
        Map<String, Object> components = (Map<String, Object>) health.get("components");
        if (components != null) {
            for (Map.Entry<String, Object> entry : components.entrySet()) {
                Map<String, Object> component = (Map<String, Object>) entry.getValue();
                String componentStatus = (String) component.get("status");
                summary.append("  - ").append(entry.getKey()).append(": ").append(componentStatus).append("\n");
            }
        }

        return summary.toString().trim();
    }
}
