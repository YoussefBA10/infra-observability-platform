package com.example.backend.repository;

import com.example.backend.entity.OwaspFinding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwaspFindingRepository extends JpaRepository<OwaspFinding, Long> {
}
