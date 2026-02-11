package com.example.backend.dto;

import java.util.List;

public class AiAnalysisResponse {
    private String summary;
    private List<String> recommendations;

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
}
