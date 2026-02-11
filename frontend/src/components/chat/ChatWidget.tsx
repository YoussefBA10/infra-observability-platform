/**
 * ChatWidget Component
 * A floating chat component that can be added to any page.
 */

import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import ChatContainer from './ChatContainer';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [conversationId, setConversationId] = useState<number | null>(null);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${isOpen
                    ? 'bg-gray-800 text-white rotate-90 scale-90'
                    : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-110 active:scale-95'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>

            {/* Chat Panel */}
            <div className={`fixed bottom-24 right-6 w-[400px] h-[600px] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl transition-all duration-300 transform origin-bottom-right ${isOpen
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
                }`}>
                <div className="flex flex-col h-full overflow-hidden rounded-2xl">
                    <ChatContainer
                        conversationId={conversationId}
                        onNewConversation={setConversationId}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;
