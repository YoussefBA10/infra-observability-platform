package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Pipeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;
    private String status;
    private Long duration;
    private String commitHash;
    private String component;
    private String appVersion;

    @OneToOne(mappedBy = "pipeline", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private SonarReport sonarReport;

    @OneToMany(mappedBy = "pipeline", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<TrivyFinding> trivyFindings;

    @OneToMany(mappedBy = "pipeline", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<OwaspFinding> owaspFindings;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getDuration() { return duration; }
    public void setDuration(Long duration) { this.duration = duration; }
    public String getCommitHash() { return commitHash; }
    public void setCommitHash(String commitHash) { this.commitHash = commitHash; }
    public String getComponent() { return component; }
    public void setComponent(String component) { this.component = component; }
    public String getAppVersion() { return appVersion; }
    public void setAppVersion(String appVersion) { this.appVersion = appVersion; }
    public SonarReport getSonarReport() { return sonarReport; }
    public void setSonarReport(SonarReport sonarReport) { this.sonarReport = sonarReport; }
    public List<TrivyFinding> getTrivyFindings() { return trivyFindings; }
    public void setTrivyFindings(List<TrivyFinding> trivyFindings) { this.trivyFindings = trivyFindings; }
    public List<OwaspFinding> getOwaspFindings() { return owaspFindings; }
    public void setOwaspFindings(List<OwaspFinding> owaspFindings) { this.owaspFindings = owaspFindings; }
}
