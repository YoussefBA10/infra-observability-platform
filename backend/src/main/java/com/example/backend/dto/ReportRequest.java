package com.example.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class ReportRequest {
    private String status;
    private Long duration;
    private String commitHash;
    private JsonNode sonarData;
    private JsonNode trivyData;
    private JsonNode owaspData;
    private String component;
    private String appVersion;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getDuration() { return duration; }
    public void setDuration(Long duration) { this.duration = duration; }
    public String getCommitHash() { return commitHash; }
    public void setCommitHash(String commitHash) { this.commitHash = commitHash; }
    public JsonNode getSonarData() { return sonarData; }
    public void setSonarData(JsonNode sonarData) { this.sonarData = sonarData; }
    public JsonNode getTrivyData() { return trivyData; }
    public void setTrivyData(JsonNode trivyData) { this.trivyData = trivyData; }
    public JsonNode getOwaspData() { return owaspData; }
    public void setOwaspData(JsonNode owaspData) { this.owaspData = owaspData; }
    public String getComponent() { return component; }
    public void setComponent(String component) { this.component = component; }
    public String getAppVersion() { return appVersion; }
    public void setAppVersion(String appVersion) { this.appVersion = appVersion; }
}
