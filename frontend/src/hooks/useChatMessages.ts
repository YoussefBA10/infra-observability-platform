/**
 * useChatMessages Hook
 * Custom hook for managing chat state including messages, loading, and errors.
 * Provides sendMessage function and manages all chat-related side effects.
 */

import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types/chat';
import { sendChatMessage } from '../services/chatApi';

/**
 * Generates a unique ID for messages.
 */
const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Custom hook for chat message management.
 * Handles sending messages, receiving responses, and error states.
 */
export function useChatMessages() {
    const [state, setState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        error: null,
    });

    /**
     * Sends a user message and gets the bot response.
     * Updates state at each stage: user message added, loading, response/error.
     */
    const sendMessage = useCallback(async (content: string) => {
        // Create user message
        const userMessage: Message = {
            id: generateId(),
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
            // Call the chat API
            const response = await sendChatMessage({ message: content });

            // Create bot response message
            const botMessage: Message = {
                id: generateId(),
                content: response.reply,
                sender: 'bot',
                timestamp: new Date(),
            };

            // Add bot message and clear loading state
            setState((prev) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
                isLoading: false,
            }));
        } catch (error) {
            // Handle API errors
            const errorMessage = error instanceof Error
                ? error.message
                : 'An unexpected error occurred. Please try again.';

            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
        }
    }, []);

    /**
     * Clears the error state.
     */
    const clearError = useCallback(() => {
        setState((prev) => ({
            ...prev,
            error: null,
        }));
    }, []);

    /**
     * Clears all messages and resets the chat.
     */
    const clearChat = useCallback(() => {
        setState({
            messages: [],
            isLoading: false,
            error: null,
        });
    }, []);

    return {
        messages: state.messages,
        isLoading: state.isLoading,
        error: state.error,
        sendMessage,
        clearError,
        clearChat,
    };
}
