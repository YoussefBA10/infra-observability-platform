package com.example.backend.service;

import com.example.backend.entity.Conversation;
import com.example.backend.entity.ChatMessage;
import com.example.backend.entity.User;
import com.example.backend.repository.ConversationRepository;
import com.example.backend.repository.ChatMessageRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatHistoryService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public ChatHistoryService(ConversationRepository conversationRepository,
                              ChatMessageRepository chatMessageRepository,
                              UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Conversation startConversation(String username, String title) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Conversation conversation = new Conversation(user, title);
        return conversationRepository.save(conversation);
    }

    @Transactional(readOnly = true)
    public List<Conversation> getUserConversations(String username) {
        return conversationRepository.findByUser_UsernameOrderByCreatedAtDesc(username);
    }

    @Transactional(readOnly = true)
    public Conversation getConversation(Long conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
    }

    @Transactional
    public ChatMessage addMessage(Long conversationId, String role, String content) {
        Conversation conversation = getConversation(conversationId);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation); // Update timestamp

        ChatMessage message = new ChatMessage(conversation, role, content);
        return chatMessageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<Map<String, String>> getConversationHistory(Long conversationId) {
        List<ChatMessage> messages = chatMessageRepository.findByConversation_IdOrderByTimestampAsc(conversationId);
        return messages.stream().map(msg -> {
            Map<String, String> map = new HashMap<>();
            map.put("role", msg.getRole());
            map.put("content", msg.getContent());
            return map;
        }).collect(Collectors.toList());
    }

    // Legacy method support if needed, or remove it. 
    // Adapting legacy generic `addMessage` to create a new conversation if needed is handled in Controller.
}
