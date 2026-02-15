import { useState, useEffect } from 'react';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import AIInsightPanel from '../components/reports/AIInsightPanel';
import { reportService, SonarReport } from '../services/reportService';
import { aiService, AiAnalysisResponse } from '../services/aiService';
import ComponentSwitcher from '../components/reports/ComponentSwitcher';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Bug, ShieldAlert, Zap } from 'lucide-react';

const CodeQuality = () => {
    const [report, setReport] = useState<SonarReport | null>(null);
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
            const latest = await reportService.getLatestReport(component);
            if (latest && latest.id) {
                const sonar = await reportService.getSonarReport(latest.id);
                setReport(sonar);
                setError('');
                if (sonar) {
                    fetchAiInsights(latest.id, sonar);
                }
            } else {
                setReport(null);
                setError(`No ${component} report found.`);
            }
        } catch (err) {
            setReport(null);
            setError(`Failed to fetch ${component} quality metrics.`);
        } finally {
            setLoading(false);
        }
    };

    const fetchAiInsights = async (pipelineId: number, data: SonarReport) => {
        setAiLoading(true);
        setAiError(false);
        try {
            const insights = await aiService.analyzePage('code-quality', pipelineId, {
                bugs: data.bugs,
                vulnerabilities: data.vulnerabilities,
                codeSmells: data.codeSmells,
                duplication: data.duplication
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

    const pieData = [
        { name: 'Bugs', value: report?.bugs || 0, color: '#ef4444' },
        { name: 'Code Smells', value: report?.codeSmells || 0, color: '#f59e0b' },
        { name: 'Vulnerabilities', value: report?.vulnerabilities || 0, color: '#3b82f6' },
    ];

    const barData = [
        { name: 'Duplication', value: report?.duplication || 0, color: '#6366f1' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Code Quality Intelligence</h1>
                <p className="text-slate-400 mt-1">
                    Deep analysis via SonarQube integration
                    {report && <span className="text-blue-400 font-bold ml-2">• Build #{report.id}</span>}
                </p>
                <div className="mt-4">
                    <ComponentSwitcher currentComponent={component} onComponentChange={setComponent} />
                </div>
            </div>

            {report && (
                <AIInsightPanel
                    loading={aiLoading}
                    error={aiError}
                    summary={aiInsights?.summary}
                    recommendations={aiInsights?.recommendations}
                    onRefresh={() => {
                        reportService.getLatestReport(component).then(latest => {
                            if (latest && latest.id && report) fetchAiInsights(latest.id, report);
                        });
                    }}
                />
            )}

            {error && <Alert type="error" message={error} />}

            {report ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-red-500/10 text-red-500"><Bug /></div>
                            <div>
                                <p className="text-sm text-slate-400">Fixed Bugs</p>
                                <p className="text-2xl font-bold text-white">{report.bugs}</p>
                            </div>
                        </div>
                        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500"><Zap /></div>
                            <div>
                                <p className="text-sm text-slate-400">Code Smells</p>
                                <p className="text-2xl font-bold text-white">{report.codeSmells}</p>
                            </div>
                        </div>
                        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500"><ShieldAlert /></div>
                            <div>
                                <p className="text-sm text-slate-400">Duplication</p>
                                <p className="text-2xl font-bold text-white">{report.duplication}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-6">Issue Distribution</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-6">Health Indicators (%)</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 rounded-3xl border border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-700">
                            <h3 className="text-xl font-bold text-white">Recent Violations</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase font-bold tracking-widest">
                                        <th className="px-6 py-4">File Path</th>
                                        <th className="px-6 py-4">Rule Violation</th>
                                        <th className="px-6 py-4">Severity</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {[1, 2, 3].map(i => (
                                        <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-300">src/main/java/controller/Auth.java</td>
                                            <td className="px-6 py-4 text-sm text-white">Hardcoded security tokens detected</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-black rounded uppercase">Blocker</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 italic">Historical data...</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-12 text-center">
                    <p className="text-slate-400">No SonarQube data available for this report.</p>
                </div>
            )}
        </div>
    );
};

export default CodeQuality;
