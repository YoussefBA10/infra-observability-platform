/**
 * Chat API Service
 * Handles communication with the chat backend.
 */

import { ChatApiRequest, ChatApiResponse, Conversation, Message } from '../types/chat';
import { API_URL } from '../config';

const USE_MOCK_API = false;

export const getConversations = async (token: string): Promise<Conversation[]> => {
    if (USE_MOCK_API) return []; // Mock not implemented for this

    const response = await fetch(`${API_URL}/chat/conversations`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch conversations');
    }

    return response.json();
};

export const getConversationHistory = async (token: string, conversationId: number): Promise<Message[]> => {
    if (USE_MOCK_API) return [];

    const response = await fetch(`${API_URL}/chat/conversations/${conversationId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch conversation history');
    }

    const data = await response.json();
    // Map backend history to frontend Message type
    // Backend returns [{role: "user", content: "..."}]
    return data.map((msg: any, index: number) => ({
        id: `hist-${conversationId}-${index}`,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot',
        timestamp: new Date(), // Timestamp not currently returned by this endpoint, using now
    }));
};

export const sendChatMessage = async (
    content: string,
    token: string,
    conversationId?: number,
    context?: string
): Promise<ChatApiResponse> => {
    if (USE_MOCK_API) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    reply: "Mock response. Backend is disabled.",
                    conversationId: conversationId || 123
                });
            }, 1000);
        });
    }

    const payload: ChatApiRequest = {
        message: content,
        conversationId,
        context
    };

    const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send message');
    }

    return response.json();
};
