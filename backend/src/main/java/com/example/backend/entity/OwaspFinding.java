package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
public class OwaspFinding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dependency;
    private Double cvss;
    private Integer severity; // Normalized 1-5

    @ManyToOne
    @JoinColumn(name = "pipeline_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Pipeline pipeline;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDependency() { return dependency; }
    public void setDependency(String dependency) { this.dependency = dependency; }
    public Double getCvss() { return cvss; }
    public void setCvss(Double cvss) { this.cvss = cvss; }
    public Integer getSeverity() { return severity; }
    public void setSeverity(Integer severity) { this.severity = severity; }
    public Pipeline getPipeline() { return pipeline; }
    public void setPipeline(Pipeline pipeline) { this.pipeline = pipeline; }
}
