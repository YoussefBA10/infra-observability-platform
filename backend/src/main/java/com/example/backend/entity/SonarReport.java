package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
public class SonarReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer bugs;
    private Integer vulnerabilities;
    private Integer codeSmells;
    private Double coverage;
    private Double duplication;

    @OneToOne
    @JoinColumn(name = "pipeline_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Pipeline pipeline;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getBugs() { return bugs; }
    public void setBugs(Integer bugs) { this.bugs = bugs; }
    public Integer getVulnerabilities() { return vulnerabilities; }
    public void setVulnerabilities(Integer vulnerabilities) { this.vulnerabilities = vulnerabilities; }
    public Integer getCodeSmells() { return codeSmells; }
    public void setCodeSmells(Integer codeSmells) { this.codeSmells = codeSmells; }
    public Double getCoverage() { return coverage; }
    public void setCoverage(Double coverage) { this.coverage = coverage; }
    public Double getDuplication() { return duplication; }
    public void setDuplication(Double duplication) { this.duplication = duplication; }
    public Pipeline getPipeline() { return pipeline; }
    public void setPipeline(Pipeline pipeline) { this.pipeline = pipeline; }
}
