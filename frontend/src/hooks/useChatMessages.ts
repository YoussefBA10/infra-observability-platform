/**
 * useChatMessages Hook
 * Custom hook for managing chat state including messages, loading, and errors.
 * Provides sendMessage function and manages all chat-related side effects.
 */

import { useState, useCallback, useEffect } from 'react';
import { Message, ChatState } from '../types/chat';
import { sendChatMessage, getConversationHistory } from '../services/chatApi';
import { useAuth } from './useAuth';

/**
 * Custom hook for chat message management.
 * Handles sending messages, receiving responses, and error states.
 */
export function useChatMessages(conversationId: number | null) {
    const { token } = useAuth();
    const [state, setState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (conversationId && token) {
            loadHistory(conversationId);
        } else {
            setState(prev => ({ ...prev, messages: [], error: null }));
        }
    }, [conversationId, token]);

    const loadHistory = async (id: number) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const history = await getConversationHistory(token!, id);
            setState(prev => ({ ...prev, messages: history, isLoading: false }));
        } catch (error) {
            setState(prev => ({ ...prev, error: 'Failed to load history', isLoading: false }));
        }
    };

    /**
     * Sends a user message and gets the bot response.
     * Updates state at each stage: user message added, loading, response/error.
     */
    const sendMessage = useCallback(async (content: string) => {
        // Create user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            sender: 'user',
            timestamp: new Date(),
        };

        // Add user message and set loading state
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isLoading: true,
            error: null,
        }));

        try {
            // Get current page context
            const context = window.location.pathname;

            // Call the chat API with the auth token and context
            const response = await sendChatMessage(content, token || '', conversationId || undefined, context);

            // Create bot message from response
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: response.reply,
                sender: 'bot',
                timestamp: new Date(),
            };

            // Add bot response and clear loading
            setState((prev) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
                isLoading: false,
            }));

            return response.conversationId;
        } catch (error: any) {
            // Handle error and reset loading
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to send message',
            }));
            throw error;
        }
    }, [token, conversationId]);

    const clearChat = useCallback(() => {
        setState((prev) => ({ ...prev, messages: [], error: null }));
    }, []);

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    return {
        ...state,
        sendMessage,
        clearError,
        clearChat,
        // No explicit refresh needed as useEffect handles it
    };
}
