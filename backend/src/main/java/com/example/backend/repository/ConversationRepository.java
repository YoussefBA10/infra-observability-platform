package com.example.backend.repository;

import com.example.backend.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByUser_UsernameOrderByCreatedAtDesc(String username);
}
