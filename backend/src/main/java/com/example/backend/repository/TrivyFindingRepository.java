package com.example.backend.repository;

import com.example.backend.entity.TrivyFinding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrivyFindingRepository extends JpaRepository<TrivyFinding, Long> {
}
