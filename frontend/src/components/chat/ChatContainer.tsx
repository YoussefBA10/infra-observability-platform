/**
 * ChatContainer Component
 * Main orchestrator for the chat interface.
 * Manages layout, auto-scroll, and combines all chat sub-components.
 */

import React, { useRef, useEffect } from 'react';
import { MessageCircle, Trash2, Terminal } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import ParticleBackground from './ParticleBackground';
import Alert from '../ui/Alert';
import { useChatMessages } from '../../hooks/useChatMessages';

interface ChatContainerProps {
    conversationId: number | null;
    onNewConversation: (id: number) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ conversationId, onNewConversation }) => {
    const { messages, isLoading, error, sendMessage, clearError, clearChat } = useChatMessages(conversationId);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (content: string) => {
        const newId = await sendMessage(content);
        // If we were in a new chat (null id) and got an id back, notify parent
        if (!conversationId && newId) {
            onNewConversation(newId);
        }
    };

    return (
        <div className="relative flex flex-col h-full bg-transparent overflow-hidden">
            {/* 3D Particle Background */}
            <ParticleBackground />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-gray-800/40 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25">
                        <Terminal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white">DevOps Assistant</h1>
                        <p className="text-xs text-gray-400">Infrastructure AI • Always Online</p>
                    </div>
                </div>

                {/* Clear Chat Button */}
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear</span>
                    </button>
                )}
            </header>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
            >
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">How can I help you today?</p>
                        <p className="text-sm opacity-75">Ask about your infrastructure, pipelines, or logs.</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}

                {isLoading && <TypingIndicator />}

                {/* Error Alert */}
                {error && (
                    <div className="my-4">
                        <Alert
                            type="error"
                            message={error}
                            onClose={clearError}
                        />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative z-10 p-6 border-t border-gray-800/50 bg-gray-800/40 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto">
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                    />
                    <div className="flex justify-center mt-2">
                        <p className="text-xs text-gray-500">
                            AI can make mistakes. Verify critical DevOps operations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;
