package com.example.backend.repository;

import com.example.backend.entity.Pipeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PipelineRepository extends JpaRepository<Pipeline, Long> {
    
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Pipeline p WHERE p.component = :component OR (:component = 'backend' AND p.component IS NULL) ORDER BY p.timestamp DESC")
    java.util.List<Pipeline> findByComponentWithLegacy(@org.springframework.data.repository.query.Param("component") String component);

    default java.util.Optional<Pipeline> findTopByComponentWithLegacy(String component) {
        return findByComponentWithLegacy(component).stream().findFirst();
    }
}
