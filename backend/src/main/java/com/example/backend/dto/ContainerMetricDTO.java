package com.example.backend.dto;

public class ContainerMetricDTO {
    private String name;
    private String service;
    private String status;
    private String cpu;
    private String memory;
    private String uptime;
    private String node;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCpu() { return cpu; }
    public void setCpu(String cpu) { this.cpu = cpu; }
    public String getMemory() { return memory; }
    public void setMemory(String memory) { this.memory = memory; }
    public String getUptime() { return uptime; }
    public void setUptime(String uptime) { this.uptime = uptime; }
    public String getNode() { return node; }
    public void setNode(String node) { this.node = node; }
}
