import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Conversation } from '../../types/chat';
import { getConversations } from '../../services/chatApi';
import { useAuth } from '../../hooks/useAuth';

interface ChatSidebarProps {
    onSelectConversation: (id: number | null) => void;
    selectedId: number | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectConversation, selectedId }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        if (token) loadConversations();
    }, [token, selectedId]);

    const loadConversations = async () => {
        try {
            const data = await getConversations(token!);
            setConversations(data);
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const groupConversations = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const groups = [
            { label: 'Today', items: [] as Conversation[] },
            { label: 'Yesterday', items: [] as Conversation[] },
            { label: 'Previous 7 Days', items: [] as Conversation[] },
            { label: 'Older', items: [] as Conversation[] }
        ];

        conversations.forEach(c => {
            const date = new Date(c.createdAt);
            if (isSameDay(date, today)) groups[0].items.push(c);
            else if (isSameDay(date, yesterday)) groups[1].items.push(c);
            else if (today.getTime() - date.getTime() < 7 * 86400000) groups[2].items.push(c);
            else groups[3].items.push(c);
        });

        return groups.filter(g => g.items.length > 0);
    };

    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
    const groups = groupConversations();

    return (
        <div className={`relative flex flex-col h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute top-1/2 -right-4 w-8 h-8 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-50 ${!isOpen && 'translate-x-4'}`}
            >
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            <div className={`flex flex-col h-full overflow-hidden ${!isOpen && 'hidden'}`}>
                <div className="p-3 space-y-2">
                    <button
                        onClick={() => onSelectConversation(null)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> <span>New Chat</span>
                    </button>
                    <Link to="/" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <LayoutDashboard size={16} /> <span>Dashboard</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-3">
                    {groups.map((group) => (
                        <div key={group.label} className="mb-4">
                            <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase">{group.label}</h3>
                            <div className="space-y-1">
                                {group.items.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => onSelectConversation(conv.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${selectedId === conv.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}
                                    >
                                        {conv.title || 'New Chat'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {conversations.length === 0 && <div className="px-3 py-4 text-center text-xs text-gray-500">No history yet.</div>}
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
