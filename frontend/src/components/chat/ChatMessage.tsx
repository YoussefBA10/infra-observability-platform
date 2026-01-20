/**
 * ChatMessage Component
 * Displays individual message bubbles in the chat interface.
 * User messages are right-aligned with blue styling.
 * Bot messages are left-aligned with gray styling.
 */

import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../../types/chat';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    // Format timestamp for display
    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div
            className={`flex items-start gap-3 animate-fadeIn ${isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${isUser
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}
            >
                {isUser ? (
                    <User className="w-5 h-5 text-white" />
                ) : (
                    <Bot className="w-5 h-5 text-white" />
                )}
            </div>

            {/* Message Bubble */}
            <div
                className={`group max-w-[75%] ${isUser ? 'items-end' : 'items-start'
                    }`}
            >
                <div
                    className={`relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${isUser
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-md'
                            : 'bg-gray-800/80 text-gray-100 border border-gray-700/50 rounded-tl-md'
                        }`}
                >
                    {/* Message content with markdown-like formatting */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </div>
                </div>

                {/* Timestamp */}
                <div
                    className={`mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'text-right' : 'text-left'
                        }`}
                >
                    {formatTime(message.timestamp)}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
