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

const ChatContainer: React.FC = () => {
    const { messages, isLoading, error, sendMessage, clearError, clearChat } = useChatMessages();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    return (
        <div className="relative flex flex-col h-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
            {/* 3D Particle Background */}
            <ParticleBackground />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl">
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
                        <span className="hidden sm:inline">Clear Chat</span>
                    </button>
                )}
            </header>

            {/* Messages Container */}
            <div
                ref={messagesContainerRef}
                className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4"
            >
                {/* Welcome Message */}
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fadeIn">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 border border-gray-700/50 flex items-center justify-center mb-6 backdrop-blur-sm">
                            <MessageCircle className="w-10 h-10 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome to DevOps Assistant
                        </h2>
                        <p className="text-gray-400 max-w-md mb-8">
                            Your AI-powered infrastructure companion. Ask about deployments,
                            containers, pipelines, monitoring, and more.
                        </p>

                        {/* Quick Action Chips */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                '🚀 Deployment status',
                                '🐳 Docker containers',
                                '📊 Monitoring health',
                                '📋 Pipeline status',
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => sendMessage(suggestion.replace(/^[^\s]+\s/, ''))}
                                    className="px-4 py-2 text-sm text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-full transition-all hover:scale-105 hover:border-blue-500/50"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Message List */}
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}

                {/* Typing Indicator */}
                {isLoading && <TypingIndicator />}

                {/* Error Alert */}
                {error && (
                    <div className="max-w-lg mx-auto">
                        <Alert
                            type="error"
                            message={error}
                            onClose={clearError}
                            dismissible
                        />
                    </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative z-10 px-4 sm:px-6 py-4 border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto">
                    <ChatInput
                        onSendMessage={sendMessage}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;
