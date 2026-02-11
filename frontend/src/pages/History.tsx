import { useState, useEffect } from 'react';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import ComponentSwitcher from '../components/reports/ComponentSwitcher';
import TrendChart from '../components/reports/TrendChart';
import AIInsightPanel from '../components/reports/AIInsightPanel';
import { reportService, Pipeline } from '../services/reportService';
import { aiService, AiAnalysisResponse } from '../services/aiService';
import { History as HistoryIcon, TrendingUp, ShieldCheck } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState<Pipeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [component, setComponent] = useState('backend');

    // AI State
    const [aiInsights, setAiInsights] = useState<AiAnalysisResponse | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await reportService.getHistory(component);
            const historyData = data || [];
            setHistory(historyData);
            setError('');
            if (historyData.length > 0) {
                fetchAiInsights(historyData);
            }
        } catch (err) {
            setHistory([]);
            setError(`Failed to fetch historical data for ${component}.`);
        } finally {
            setLoading(false);
        }
    };

    const fetchAiInsights = async (data: Pipeline[]) => {
        if (data.length === 0) return;
        setAiLoading(true);
        setAiError(false);
        try {
            const insights = await aiService.analyzePage('history', data[0].id, {
                count: data.length,
                successRate: (data.filter(p => p.status === 'SUCCESS').length / data.length * 100).toFixed(1),
                vulnerabilityTrend: data.slice(0, 5).map(p => (p.trivyFindings?.length || 0) + (p.owaspFindings?.length || 0))
            });
            setAiInsights(insights);
        } catch (err) {
            setAiError(true);
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [component]);

    if (loading) return <div className="flex justify-center items-center m-10"><Loader /></div>;

    // Prepare data for charts
    const trendData = [...history].reverse().map(p => ({
        timestamp: p.timestamp,
        vulnerabilities: (p.trivyFindings?.length || 0) + (p.owaspFindings?.length || 0),
        status: p.status === 'SUCCESS' ? 1 : 0
    }));

    const successRate = history.length > 0
        ? (history.filter(p => p.status === 'SUCCESS').length / history.length * 100).toFixed(1)
        : 0;

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Historical Intelligence</h1>
                    <p className="text-slate-400 mt-1">Platform quality evolution and stability trends</p>
                    <div className="mt-4">
                        <ComponentSwitcher currentComponent={component} onComponentChange={setComponent} />
                    </div>
                </div>
                {history.length > 0 && (
                    <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg"><TrendingUp /></div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-black">Global Success Rate</p>
                            <p className="text-2xl font-black text-white">{successRate}%</p>
                        </div>
                    </div>
                )}
            </div>

            {history.length > 0 && (
                <AIInsightPanel
                    loading={aiLoading}
                    error={aiError}
                    summary={aiInsights?.summary}
                    recommendations={aiInsights?.recommendations}
                    onRefresh={() => fetchAiInsights(history)}
                />
            )}

            {error && <Alert type="error" message={error} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><ShieldCheck size={20} /></div>
                        <h3 className="text-xl font-bold text-white">Security Debt Trend</h3>
                    </div>
                    <TrendChart
                        data={trendData}
                        dataKey="vulnerabilities"
                        color="#ef4444"
                        type="area"
                        height={250}
                    />
                </div>

            </div>

            <div className="bg-slate-800/40 rounded-3xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex items-center gap-3">
                    <HistoryIcon className="text-slate-500" />
                    <h3 className="text-xl font-bold text-white">Pipeline Execution Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Version</th>
                                <th className="px-6 py-4">Commit Hash</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Vulnerabilities</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {history.map((p, i) => (
                                <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-300">
                                        {new Date(p.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-white">{p.appVersion || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-blue-400">{p.commitHash?.substring(0, 7) || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${p.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white font-bold">
                                        {(p.trivyFindings?.length || 0) + (p.owaspFindings?.length || 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
