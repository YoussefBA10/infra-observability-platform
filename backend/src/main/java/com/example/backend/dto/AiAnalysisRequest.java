package com.example.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class AiAnalysisRequest {
    private String page;
    private Long pipelineId;
    private JsonNode data;

    public String getPage() { return page; }
    public void setPage(String page) { this.page = page; }
    public Long getPipelineId() { return pipelineId; }
    public void setPipelineId(Long pipelineId) { this.pipelineId = pipelineId; }
    public JsonNode getData() { return data; }
    public void setData(JsonNode data) { this.data = data; }
}
