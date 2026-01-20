/**
 * Chat Types
 * Type definitions for the DevOps chatbot interface.
 */

/**
 * Represents a single message in the chat.
 */
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

/**
 * Request payload for the chat API.
 * Matches the API contract: POST /api/chat
 */
export interface ChatApiRequest {
    message: string;
}

/**
 * Response from the chat API.
 * Matches the API contract response format.
 */
export interface ChatApiResponse {
    reply: string;
}

/**
 * State for the chat hook.
 */
export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}
