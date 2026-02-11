package com.example.backend.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Client for querying Prometheus metrics via PromQL.
 */
@Component
public class PrometheusClient {

    private static final Logger logger = LoggerFactory.getLogger(PrometheusClient.class);

    @Value("${prometheus.url}")
    private String prometheusUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Query CPU usage percentage for a specific node.
     */
    public Double queryNodeCpuUsage(String nodeIp) {
        String query = String.format("100 - (avg(rate(node_cpu_seconds_total{instance=~\"%s:.*\",mode=\"idle\"}[5m])) * 100)", nodeIp);
        return executeQuery(query);
    }

    /**
     * Query Memory usage percentage for a specific node.
     */
    public Double queryNodeMemoryUsage(String nodeIp) {
        String query = String.format("(1 - (node_memory_MemAvailable_bytes{instance=~\"%s:.*\"} / node_memory_MemTotal_bytes{instance=~\"%s:.*\"})) * 100", nodeIp, nodeIp);
        return executeQuery(query);
    }

    /**
     * Query Disk usage percentage for a specific node.
     */
    public Double queryNodeDiskUsage(String nodeIp) {
        String query = String.format("(1 - (node_filesystem_avail_bytes{instance=~\"%s:.*\",mountpoint=\"/\"} / node_filesystem_size_bytes{instance=~\"%s:.*\",mountpoint=\"/\"})) * 100", nodeIp, nodeIp);
        return executeQuery(query);
    }

    /**
     * Query top CPU-consuming containers via cAdvisor.
     */
    public List<Map<String, Object>> queryTopContainersCpu(String nodeIp) {
    String query = String.format(
    "topk(5, sum by (name) (" +
    "rate(container_cpu_usage_seconds_total{" +
    "instance=~\"%s:.*\", name!=\"\"" +
    "}[1m])" +
    "))",
    nodeIp
);
    return executeComplexQuery(query);
}



    /**
     * Query top Memory-consuming containers via cAdvisor.
     */
    public List<Map<String, Object>> queryTopContainersMemory(String nodeIp) {
    String query = String.format(
        "topk(5, sum by (name) (" +
        "container_memory_usage_bytes{" +
        "instance=~\"%s:.*\", name!=\"\", name!=\"cadvisor\"" +
        "}))",
        nodeIp
    );
    return executeComplexQuery(query);
}

    /**
     * Query top Network-consuming containers via cAdvisor.
     */
    public List<Map<String, Object>> queryTopContainersNetwork(String nodeIp) {
        String query = String.format(
            "topk(5, sum by (name) (" +
            "rate(container_network_receive_bytes_total{" +
            "instance=~\"%s:.*\", name!=\"\", name!=\"cadvisor\"" +
            "}[1m])))",
            nodeIp
        );
        return executeComplexQuery(query);
    }


    /**
     * Execute a PromQL query and extract the first result value.
     */
    @SuppressWarnings("unchecked")
    private Double executeQuery(String query) {
        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(prometheusUrl)
                    .path("/api/v1/query")
                    .queryParam("query", query)
                    .build()
                    .toUri();

            ResponseEntity<Map> response = restTemplate.getForEntity(uri, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                if ("success".equals(body.get("status"))) {
                    Map<String, Object> data = (Map<String, Object>) body.get("data");
                    List<Map<String, Object>> result = (List<Map<String, Object>>) data.get("result");
                    if (result != null && !result.isEmpty()) {
                        List<Object> value = (List<Object>) result.get(0).get("value");
                        if (value != null && value.size() > 1) {
                            return Double.parseDouble(value.get(1).toString());
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Prometheus query failed: {} - {}", query, e.getMessage());
        }
        return null;
    }

    /**
     * Execute a PromQL query and return multiple results (e.g., for container lists).
     */
    @SuppressWarnings("unchecked")
private List<Map<String, Object>> executeComplexQuery(String query) {
    try {
        URI uri = UriComponentsBuilder.fromHttpUrl(prometheusUrl)
                .path("/api/v1/query")
                .queryParam("query", query)
                .build()
                .toUri();

        ResponseEntity<Map> response = restTemplate.getForEntity(uri, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> body = response.getBody();
            if ("success".equals(body.get("status"))) {
                Map<String, Object> data = (Map<String, Object>) body.get("data");
                List<Map<String, Object>> result = (List<Map<String, Object>>) data.get("result");

                // Convert each entry to a Map with metric labels and value
                List<Map<String, Object>> cleanedResult = new java.util.ArrayList<>();
                for (Map<String, Object> entry : result) {
                    Map<String, Object> metric = (Map<String, Object>) entry.get("metric");
                    List<Object> value = (List<Object>) entry.get("value");
                    if (metric != null && value != null && value.size() > 1) {
                        Map<String, Object> map = new java.util.HashMap<>(metric); // Keep all labels
                        
                        // Ensure 'name' exists for backward compatibility, prioritizing specific pipeline identifiers
                        String name = (String) metric.get("job_name");
                        if (name == null) name = (String) metric.get("jenkins_job");
                        if (name == null) name = (String) metric.get("full_name");
                        if (name == null) name = (String) metric.get("displayName");
                        if (name == null) name = (String) metric.get("name");
                        if (name == null) name = (String) metric.get("container_name");
                        
                        // Use 'job' only if it's not the generic 'jenkins' scrape job name
                        if (name == null) {
                            String jobLabel = (String) metric.get("job");
                            if (!"jenkins".equals(jobLabel)) {
                                name = jobLabel;
                            }
                        }
                        
                        if (name == null) name = "Unknown Pipeline";
                        
                        map.put("name", name);
                        map.put("value", Double.parseDouble(value.get(1).toString()));
                        cleanedResult.add(map);
                    }
                }
                return cleanedResult;
            }
        }
    } catch (Exception e) {
        logger.warn("Prometheus complex query failed: {} - {}", query, e.getMessage());
    }
    return List.of();
}

    /**
     * Query Probe Success for a specific job (Blackbox Exporter).
     */
    public boolean queryProbeSuccess(String jobName) {
        String query = String.format("probe_success{job=\"%s\"}", jobName);
        Double result = executeQuery(query);
        return result != null && result == 1.0;
    }

    /**
     * Query count of active alerts by severity.
     */
    public int queryAlertCount(String severity) {
        String query = String.format("count(ALERTS{alertstate=\"firing\", severity=\"%s\"})", severity);
        Double result = executeQuery(query);
        return (result != null) ? result.intValue() : 0;
    }

    /**
     * Query total count of firing alerts.
     */
    public int queryTotalAlerts() {
        String query = "count(ALERTS{alertstate=\"firing\"})";
        Double result = executeQuery(query);
        return (result != null) ? result.intValue() : 0;
    }

    /**
     * Query 'up' metric for a specific job.
     */
    public boolean queryServiceUp(String jobName) {
        String query = String.format("up{job=\"%s\"}", jobName);
        Double result = executeQuery(query);
        return result != null && result == 1.0;
    }

    /**
     * Calculate average value over a time range (e.g., for uptime %).
     */
    public Double queryAverageOverTime(String metricName, String labelSelector, String range) {
        String query = String.format("avg_over_time(%s{%s}[%s]) * 100", metricName, labelSelector, range);
        return executeQuery(query);
    }

    /**
     * Calculate rate of success vs total (e.g., for delivery success %).
     */
    public Double querySuccessRate(String successMetric, String totalMetric, String range) {
        String query = String.format("sum(rate(%s[%s])) / sum(rate(%s[%s])) * 100", successMetric, range, totalMetric, range);
        return executeQuery(query);
    }

    /**
     * Query count of active containers via cAdvisor (fresh within 60s).
     */
    public int queryActiveContainerCount() {
        String query = "count(sum by (name) (container_last_seen{name!=\"\", name!=\"cadvisor\"} > time() - 60))";
        Double result = executeQuery(query);
        return (result != null) ? result.intValue() : 0;
    }

    /**
     * Query count of stopped containers (last seen in 24h but not in 60s).
     */
    public int queryStoppedContainerCount() {
        String query = "count(sum by (name) (container_last_seen{name!=\"\", name!=\"cadvisor\"} > time() - 86400)) - count(sum by (name) (container_last_seen{name!=\"\", name!=\"cadvisor\"} > time() - 60))";
        Double result = executeQuery(query);
        int count = (result != null) ? result.intValue() : 0;
        return Math.max(0, count);
    }

    /**
     * Query ALL active container names across the cluster.
     */
    public List<String> queryActiveContainerList() {
        String query = "sum by (name) (container_last_seen{name!=\"\", name!=\"cadvisor\"} > time() - 60)";
        List<Map<String, Object>> results = executeComplexQuery(query);
        return results.stream()
                .map(m -> (String) m.get("name"))
                .filter(name -> name != null && !name.isEmpty())
                .collect(Collectors.toList());
    }

    /**
     * Query active container names for a specific node.
     */
    public List<String> queryActiveContainerList(String nodeIp) {
        String query = String.format("sum by (name) (container_last_seen{instance=~\"%s:.*\", name!=\"\", name!=\"cadvisor\"} > time() - 60)", nodeIp);
        List<Map<String, Object>> results = executeComplexQuery(query);
        return results.stream()
                .map(m -> (String) m.get("name"))
                .filter(name -> name != null && !name.isEmpty())
                .collect(Collectors.toList());
    }

    /**
     * Query start times for all containers to calculate uptime.
     */
    public List<Map<String, Object>> queryContainerStartTimes(String nodeIp) {
        String query = String.format("container_start_time_seconds{instance=~\"%s:.*\", name!=\"\", name!=\"cadvisor\"}", nodeIp);
        return executeComplexQuery(query);
    }

   /**
 * Query count of total Jenkins pipelines.
 */
public int queryPipelineCount() {
    String query = "count(sum by (jenkins_job) ({__name__=~\"default_jenkins_builds_last_build_result_ordinal\"}))";
    Double result = executeQuery(query);
    return (result != null) ? result.intValue() : 0;
}

/**
 * Query count of successful Jenkins pipelines.
 */
public int queryPipelineSuccessCount() {
    String query = "count({__name__=~\"default_jenkins_builds_last_build_result\"} == 1)";
    Double result = executeQuery(query);
    return (result != null) ? result.intValue() : 0;
}

/**
 * Query count of failed Jenkins pipelines.
 */
public int queryPipelineFailedCount() {
    String query = "count({__name__=~\"default_jenkins_builds_last_build_result\"} == 0)";
    Double result = executeQuery(query);
    return (result != null) ? result.intValue() : 0;
}

/**
 * Query count of currently running Jenkins pipelines.
 */
public int queryPipelineRunningCount() {
    String query = "count({__name__=~\"default_jenkins_builds_last_build_building\"} == 1)";
    Double result = executeQuery(query);
    return (result != null) ? result.intValue() : 0;
}

/**
 * Query durations of Jenkins pipelines.
 */
public List<Map<String, Object>> queryPipelineDurations() {
    String query = "{__name__=~\"default_jenkins_builds_last_build_duration_milliseconds\"}";
    return executeComplexQuery(query);
}

/**
 * Query last build start timestamps of Jenkins pipelines.
 */
public List<Map<String, Object>> queryPipelineTimestamps() {
    String query = "{__name__=~\"default_jenkins_builds_last_build_start_time_milliseconds\"}";
    return executeComplexQuery(query);
}

/**
 * Query list of pipelines with their last result ordinal.
 */
public List<Map<String, Object>> queryPipelineList() {
    String query = "{__name__=~\"default_jenkins_builds_last_build_result_ordinal\"}";
    return executeComplexQuery(query);
}

/**
 * Query current building status for all pipelines.
 */
public List<Map<String, Object>> queryPipelineBuilding() {
    String query = "{__name__=~\"default_jenkins_builds_last_build_building\"}";
    return executeComplexQuery(query);
}

/**
 * Query success rate per pipeline over the last 7 days.
 * Uses avg_over_time on the result gauge (1 = success, 0 = fail).
 */
public List<Map<String, Object>> queryPipelineSuccessRates() {
    // Note: We use the result metric which is 1 for success. 
    // avg_over_time gives the percentage of successes.
    String query = "avg_over_time({__name__=~\"default_jenkins_builds_last_build_result\"}[7d]) * 100";
    return executeComplexQuery(query);
}

}
