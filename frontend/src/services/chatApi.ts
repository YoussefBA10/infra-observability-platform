/**
 * Chat API Service
 * Handles communication with the chat backend.
 */

import { ChatApiRequest, ChatApiResponse, Conversation, Message } from '../types/chat';
import api from './api';

const USE_MOCK_API = false;

export const getConversations = async (_token?: string): Promise<Conversation[]> => {
    if (USE_MOCK_API) return []; // Mock not implemented for this

    const response = await api.get('/chat/conversations');
    return response.data;
};

export const getConversationHistory = async (_token: string, conversationId: number): Promise<Message[]> => {
    if (USE_MOCK_API) return [];

    const response = await api.get(`/chat/conversations/${conversationId}`);
    const data = response.data;
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
    _token: string,
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

    const response = await api.post('/chat', payload);
    return response.data;
};
