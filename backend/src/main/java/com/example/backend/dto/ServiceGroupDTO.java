package com.example.backend.dto;

import java.util.List;

public class ServiceGroupDTO {
    private String group;
    private List<String> services;
    private String status;

    // Getters and Setters
    public String getGroup() { return group; }
    public void setGroup(String group) { this.group = group; }
    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
