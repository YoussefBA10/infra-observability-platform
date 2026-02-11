import React from 'react';
import { RefreshCw, Bot, AlertCircle } from 'lucide-react';

interface AIInsightPanelProps {
    summary?: string;
    recommendations?: string[];
    loading: boolean;
    error: boolean;
    onRefresh: () => void;
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({
    summary,
    recommendations,
    loading,
    error,
    onRefresh
}) => {

    if (error) {
        return (
            <div className="w-full bg-slate-800/20 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">AI insights temporarily unavailable.</span>
                </div>
                <button
                    onClick={onRefresh}
                    className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 transition-colors"
                    title="Retry Analysis"
                >
                    <RefreshCw size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
            <div className="px-6 py-4 border-b border-blue-500/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                        <Bot size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">🤖 AI Insights</h3>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${loading
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-600/20'
                        }`}
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Analyzing...' : 'Regenerate Analysis'}
                </button>
            </div>

            <div className="p-6">
                {loading && !summary ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-blue-500/10 rounded w-3/4"></div>
                        <div className="h-4 bg-blue-500/10 rounded w-1/2"></div>
                        <div className="space-y-2 pt-4">
                            <div className="h-3 bg-blue-500/5 rounded w-full"></div>
                            <div className="h-3 bg-blue-500/5 rounded w-full"></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {summary && (
                            <p className="text-slate-300 leading-relaxed text-sm lg:text-base font-medium">
                                {summary}
                            </p>
                        )}

                        {recommendations && recommendations.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-black text-blue-500/70 tracking-widest">Actionable Recommendations</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {recommendations.map((rec, index) => (
                                        <li key={index} className="flex gap-3 items-start p-3 bg-slate-900/40 border border-slate-800 rounded-xl group hover:border-blue-500/30 transition-colors">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0 group-hover:scale-125 transition-transform" />
                                            <span className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIInsightPanel;
