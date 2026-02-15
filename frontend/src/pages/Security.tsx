import { useState, useEffect } from 'react';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import AIInsightPanel from '../components/reports/AIInsightPanel';
import SeverityBadge from '../components/reports/SeverityBadge';
import ComponentSwitcher from '../components/reports/ComponentSwitcher';
import { reportService, TrivyFinding, OwaspFinding } from '../services/reportService';
import { aiService, AiAnalysisResponse } from '../services/aiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, ShieldAlert, Lock } from 'lucide-react';

const Security = () => {
    const [trivy, setTrivy] = useState<TrivyFinding[]>([]);
    const [owasp, setOwasp] = useState<OwaspFinding[]>([]);
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
                const [t, o] = await Promise.all([
                    reportService.getTrivyFindings(latest.id),
                    reportService.getOwaspFindings(latest.id)
                ]);
                const tf = t || [];
                const of = o || [];
                setTrivy(tf);
                setOwasp(of);
                setError('');
                fetchAiInsights(latest.id, tf, of);
            } else {
                setTrivy([]);
                setOwasp([]);
                setError(`No ${component} report found.`);
            }
        } catch (err) {
            setError(`Failed to fetch ${component} security findings.`);
        } finally {
            setLoading(false);
        }
    };

    const fetchAiInsights = async (pipelineId: number, tf: TrivyFinding[], of: OwaspFinding[]) => {
        setAiLoading(true);
        setAiError(false);
        try {
            const insights = await aiService.analyzePage('security', pipelineId, {
                trivyCount: tf.length,
                owaspCount: of.length,
                severityStats: getSeverityCount([...tf, ...of])
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

    const getSeverityCount = (findings: any[]) => {
        const counts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        findings.forEach(f => {
            if (f.severity === 5) counts.Critical++;
            else if (f.severity === 4) counts.High++;
            else if (f.severity === 3) counts.Medium++;
            else if (f.severity === 2) counts.Low++;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };

    const trivyStats = getSeverityCount(trivy);
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Security Intelligence</h1>
                <p className="text-slate-400 mt-1">
                    Multi-layer vulnerability scanning (Trivy & OWASP)
                    {trivy.length + owasp.length > 0 && <span className="text-blue-400 font-bold ml-2">• Verified Build</span>}
                </p>
                <div className="mt-4">
                    <ComponentSwitcher currentComponent={component} onComponentChange={setComponent} />
                </div>
            </div>

            {(trivy.length > 0 || owasp.length > 0) && (
                <AIInsightPanel
                    loading={aiLoading}
                    error={aiError}
                    summary={aiInsights?.summary}
                    recommendations={aiInsights?.recommendations}
                    onRefresh={() => {
                        reportService.getLatestReport(component).then(latest => {
                            if (latest && latest.id) fetchAiInsights(latest.id, trivy, owasp);
                        });
                    }}
                />
            )}

            {error && <Alert type="error" message={error} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-slate-800/40 p-8 rounded-3xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><ShieldCheck /></div>
                        <h3 className="text-xl font-bold text-white">Vulnerability Profile</h3>
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                            <BarChart data={trivyStats} layout="vertical" margin={{ left: -20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {trivyStats.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-800/40 rounded-3xl border border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><ShieldAlert size={20} /></div>
                                <h3 className="text-lg font-bold text-white">Trivy Image Scan</h3>
                            </div>
                            <span className="text-xs font-bold text-slate-500">{trivy.length} Findings</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-slate-900 text-slate-400 text-[10px] uppercase font-black tracking-widest z-10">
                                    <tr>
                                        <th className="px-6 py-3">CVE ID</th>
                                        <th className="px-6 py-3">Package</th>
                                        <th className="px-6 py-3">Severity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {trivy.map((f, i) => (
                                        <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                                            <td className="px-6 py-3 text-sm font-mono text-blue-400">{f.cve}</td>
                                            <td className="px-6 py-3 text-sm text-slate-300">{f.packageName}</td>
                                            <td className="px-6 py-3 text-sm">
                                                <SeverityBadge severity={f.severity} />
                                            </td>
                                        </tr>
                                    ))}
                                    {trivy.length === 0 && (
                                        <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">No container vulnerabilities detected</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 rounded-3xl border border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Lock size={20} /></div>
                                <h3 className="text-lg font-bold text-white">OWASP Dependency Check</h3>
                            </div>
                            <span className="text-xs font-bold text-slate-500">{owasp.length} Risks</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-slate-900 text-slate-400 text-[10px] uppercase font-black tracking-widest z-10">
                                    <tr>
                                        <th className="px-6 py-3">Dependency</th>
                                        <th className="px-6 py-3 text-center">CVSS</th>
                                        <th className="px-6 py-3">Severity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {owasp.map((f, i) => (
                                        <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                                            <td className="px-6 py-3 text-sm text-slate-300 max-w-[200px] truncate">{f.dependency}</td>
                                            <td className="px-6 py-3 text-sm text-center text-white font-bold">{f.cvss}</td>
                                            <td className="px-6 py-3 text-sm">
                                                <SeverityBadge severity={f.severity} />
                                            </td>
                                        </tr>
                                    ))}
                                    {owasp.length === 0 && (
                                        <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">No dependency risks detected</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
