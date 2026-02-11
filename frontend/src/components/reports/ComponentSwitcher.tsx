import React from 'react';
import { Layout, Globe } from 'lucide-react';

interface ComponentSwitcherProps {
    currentComponent: string;
    onComponentChange: (component: string) => void;
}

const ComponentSwitcher: React.FC<ComponentSwitcherProps> = ({ currentComponent, onComponentChange }) => {
    return (
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 w-fit">
            <button
                onClick={() => onComponentChange('backend')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentComponent === 'backend'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
            >
                <Layout size={16} />
                Backend Pipe
            </button>
            <button
                onClick={() => onComponentChange('frontend')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentComponent === 'frontend'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
            >
                <Globe size={16} />
                Frontend Pipe
            </button>
        </div>
    );
};

export default ComponentSwitcher;
