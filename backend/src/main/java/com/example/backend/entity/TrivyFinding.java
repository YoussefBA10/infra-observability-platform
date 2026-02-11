package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
public class TrivyFinding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer severity; // Normalized 1-5
    private String cve;
    private String packageName;

    @ManyToOne
    @JoinColumn(name = "pipeline_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Pipeline pipeline;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getSeverity() { return severity; }
    public void setSeverity(Integer severity) { this.severity = severity; }
    public String getCve() { return cve; }
    public void setCve(String cve) { this.cve = cve; }
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    public Pipeline getPipeline() { return pipeline; }
    public void setPipeline(Pipeline pipeline) { this.pipeline = pipeline; }
}
