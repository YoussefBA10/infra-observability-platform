package com.example.backend.controller;

import com.example.backend.dto.AiAnalysisRequest;
import com.example.backend.dto.AiAnalysisResponse;
import com.example.backend.service.AiAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiAnalysisService aiAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResponse> analyze(@RequestBody AiAnalysisRequest request) {
        return ResponseEntity.ok(aiAnalysisService.analyze(request));
    }
}
