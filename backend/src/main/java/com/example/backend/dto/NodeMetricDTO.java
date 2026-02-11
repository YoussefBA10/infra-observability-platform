package com.example.backend.dto;

public class NodeMetricDTO {
    private String hostname;
    private String cpuUsage;
    private String memoryUsed;
    private String memoryTotal;
    private String diskUsage;

    // Getters and Setters
    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    public String getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(String cpuUsage) { this.cpuUsage = cpuUsage; }
    public String getMemoryUsed() { return memoryUsed; }
    public void setMemoryUsed(String memoryUsed) { this.memoryUsed = memoryUsed; }
    public String getMemoryTotal() { return memoryTotal; }
    public void setMemoryTotal(String memoryTotal) { this.memoryTotal = memoryTotal; }
    public String getDiskUsage() { return diskUsage; }
    public void setDiskUsage(String diskUsage) { this.diskUsage = diskUsage; }
}
