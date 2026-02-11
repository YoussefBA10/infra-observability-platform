/**
 * ChatPage
 * Full-page chat interface for the DevOps Assistant.
 * Renders the ChatContainer alongside the ChatSidebar.
 */

import React, { useState } from 'react';
import ChatContainer from '../components/chat/ChatContainer';
import ChatSidebar from '../components/chat/ChatSidebar';

const ChatPage: React.FC = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar */}
            <ChatSidebar
                selectedId={selectedId}
                onSelectConversation={setSelectedId}
            />

            {/* Main Chat Area */}
            <div className="flex-1 min-w-0 h-full relative">
                <ChatContainer
                    conversationId={selectedId}
                    onNewConversation={setSelectedId}
                />
            </div>
        </div>
    );
};

export default ChatPage;
