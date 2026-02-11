package com.example.backend.repository;

import com.example.backend.entity.AiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {
    Optional<AiAnalysis> findTopByPipelineIdAndPageOrderByIdDesc(Long pipelineId, String page);
    void deleteByPipelineIdAndPage(Long pipelineId, String page);
}
