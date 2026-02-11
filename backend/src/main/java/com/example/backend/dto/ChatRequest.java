package com.example.backend.dto;

public class ChatRequest {
    private String message;
    private Long conversationId;
    private String context;

    public ChatRequest() {}

    public ChatRequest(String message, Long conversationId, String context) {
        this.message = message;
        this.conversationId = conversationId;
        this.context = context;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}
