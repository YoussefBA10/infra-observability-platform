package com.example.backend.dto;

public class InfrastructureSummaryDTO {
    private String health;
    private int servicesRunning;
    private int servicesTotal;
    private int containersRunning;
    private double cpuUsage;
    private int incidentsLast24h;

    // Getters and Setters
    public String getHealth() { return health; }
    public void setHealth(String health) { this.health = health; }
    public int getServicesRunning() { return servicesRunning; }
    public void setServicesRunning(int servicesRunning) { this.servicesRunning = servicesRunning; }
    public int getServicesTotal() { return servicesTotal; }
    public void setServicesTotal(int servicesTotal) { this.servicesTotal = servicesTotal; }
    public int getContainersRunning() { return containersRunning; }
    public void setContainersRunning(int containersRunning) { this.containersRunning = containersRunning; }
    public double getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(double cpuUsage) { this.cpuUsage = cpuUsage; }
    public int getIncidentsLast24h() { return incidentsLast24h; }
    public void setIncidentsLast24h(int incidentsLast24h) { this.incidentsLast24h = incidentsLast24h; }
}
