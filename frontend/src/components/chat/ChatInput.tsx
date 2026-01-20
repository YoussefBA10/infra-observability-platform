/**
 * ChatInput Component
 * Text input area with send button for composing messages.
 * Supports Enter key submission and disabled state during loading.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    isLoading,
    placeholder = 'Ask about deployments, containers, pipelines...',
}) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    }, [inputValue]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();
        if (trimmedValue && !isLoading) {
            onSendMessage(trimmedValue);
            setInputValue('');
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    // Handle Enter key (Shift+Enter for new line)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl opacity-50 blur group-focus-within:opacity-75 transition-opacity animate-gradient-x" />

            <div className="relative flex items-end gap-2 p-3 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl">
                {/* AI Indicator */}
                <div className="flex-shrink-0 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>

                {/* Text Input */}
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isLoading}
                    rows={1}
                    className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none border-none outline-none text-sm leading-relaxed min-h-[24px] max-h-[150px] disabled:opacity-50"
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-blue-500/25"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            {/* Helper text */}
            <div className="mt-2 text-center text-xs text-gray-600">
                Press Enter to send • Shift+Enter for new line
            </div>
        </form>
    );
};

export default ChatInput;
