package com.example.backend.service;

import com.example.backend.dto.AiAnalysisRequest;
import com.example.backend.dto.AiAnalysisResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.example.backend.entity.AiAnalysis;
import com.example.backend.entity.Pipeline;
import com.example.backend.repository.AiAnalysisRepository;
import com.example.backend.repository.PipelineRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AiAnalysisService {

    @Autowired
    private GroqService groqService;

    @Autowired
    private AiAnalysisRepository aiAnalysisRepository;

    @Autowired
    private PipelineRepository pipelineRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public AiAnalysisResponse analyze(AiAnalysisRequest request) {
        // 1. Check if we already have this analysis in DB
        if (request.getPipelineId() != null) {
            Optional<AiAnalysis> existing = aiAnalysisRepository.findTopByPipelineIdAndPageOrderByIdDesc(request.getPipelineId(), request.getPage());
            if (existing.isPresent()) {
                AiAnalysis analysis = existing.get();
                AiAnalysisResponse response = new AiAnalysisResponse();
                response.setSummary(analysis.getSummary());
                response.setRecommendations(analysis.getRecommendations());
                return response;
            }
        }

        // 2. If not, proceed to call LLM
        String systemPrompt = "You are a Senior DevOps Quality Analyst. Your task is to analyze DevSecOps metrics and provide executive-level insights.\n\n" +
                "RULES:\n" +
                "- Provide a concise summary of the current state.\n" +
                "- Highlight critical risks.\n" +
                "- Provide actionable, business-focused recommendations.\n" +
                "- NO technical jargon.\n" +
                "- NO emojis.\n" +
                "- NO conversational phrasing (e.g., 'Here is your analysis').\n" +
                "- ALWAYS respond in EXACTLY this JSON format:\n" +
                "{\n" +
                "  \"summary\": \"The overall platform state is...\",\n" +
                "  \"recommendations\": [\"Recommendation 1\", \"Recommendation 2\"]\n" +
                "}\n" +
                "- Do NOT include any text before or after the JSON block.";

        String userPrompt = buildUserPrompt(request.getPage(), request.getData());

        try {
            String aiResult = groqService.getChatCompletion(new ArrayList<>(), systemPrompt + "\n\nDATA:\n" + userPrompt);
            
            // Extract JSON if AI wrapped it in markdown or something
            String jsonPart = extractJson(aiResult);
            AiAnalysisResponse response = objectMapper.readValue(jsonPart, AiAnalysisResponse.class);

            // 3. Save to DB for future use (Caching) - Double check to avoid duplicates from concurrent requests
            if (request.getPipelineId() != null) {
                Optional<AiAnalysis> alreadySaved = aiAnalysisRepository.findTopByPipelineIdAndPageOrderByIdDesc(request.getPipelineId(), request.getPage());
                if (alreadySaved.isEmpty()) {
                    Optional<Pipeline> pipeline = pipelineRepository.findById(request.getPipelineId());
                    if (pipeline.isPresent()) {
                        AiAnalysis analysis = new AiAnalysis();
                        analysis.setPipeline(pipeline.get());
                        analysis.setPage(request.getPage());
                        analysis.setSummary(response.getSummary());
                        analysis.setRecommendations(response.getRecommendations());
                        aiAnalysisRepository.save(analysis);
                    }
                }
            }

            return response;
        } catch (Exception e) {
            AiAnalysisResponse fallback = new AiAnalysisResponse();
            fallback.setSummary("AI analysis currently unavailable due to processing limitations.");
            fallback.setRecommendations(List.of("Please review metrics manually in the dashboard sections below."));
            return fallback;
        }
    }

    private String buildUserPrompt(String page, JsonNode data) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Page context: ").append(page).append("\n");
        prompt.append("Metrics data:\n").append(data.toPrettyString()).append("\n\n");

        switch (page.toLowerCase()) {
            case "pipeline":
                prompt.append("Analyze recent build trends, deployment success rates, and team velocity.");
                break;
            case "security":
                prompt.append("Focus on high and critical vulnerabilities, CVE density, and security debt reduction.");
                break;
            case "code-quality":
                prompt.append("Analyze technical debt, code smells, and duplication trends.");
                break;
            case "history":
                prompt.append("Identify long-term quality trends and platform stability over time.");
                break;
            default:
                prompt.append("Provide a general executive summary and recommendations based on the provided data.");
        }
        return prompt.toString();
    }

    private String extractJson(String text) {
        if (text == null) return "{}";
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");
        if (start != -1 && end != -1 && end > start) {
            return text.substring(start, end + 1);
        }
        return text;
    }
}
