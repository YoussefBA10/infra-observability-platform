/**
 * TypingIndicator Component
 * Animated dots that show when the bot is "thinking".
 * Uses a pulsing animation for a modern look.
 */

import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-start gap-3 animate-fadeIn">
            {/* Bot Avatar */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
            </div>

            {/* Typing Bubble */}
            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-1.5">
                    {/* Animated dots */}
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
