import { useState, useEffect } from 'react';
import SummaryCard from '../components/reports/SummaryCard';
import ComponentSwitcher from '../components/reports/ComponentSwitcher';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import AIInsightPanel from '../components/reports/AIInsightPanel';
import { reportService, Pipeline } from '../services/reportService';
import { aiService, AiAnalysisResponse } from '../services/aiService';
import { Clock, Shield, CheckCircle, XCircle } from 'lucide-react';

const PipelineOverview = () => {
    const [report, setReport] = useState<Pipeline | null>(null);
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
            setReport(latest);
            setError('');
            if (latest) {
                fetchAiInsights(latest);
            }
        } catch (err) {
            setReport(null);
            setError(`No ${component} report found or failed to fetch.`);
        } finally {
            setLoading(false);
        }
    };

    const fetchAiInsights = async (data: Pipeline) => {
        setAiLoading(true);
        setAiError(false);
        try {
            const insights = await aiService.analyzePage('pipeline', data.id, {
                status: data.status,
                duration: data.duration,
                vulnerabilities: (data.trivyFindings?.length || 0) + (data.owaspFindings?.length || 0),
                bugs: data.sonarReport?.bugs,
                smells: data.sonarReport?.codeSmells,
                duplication: data.sonarReport?.duplication,
                version: data.appVersion
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

    const calculateQualityScore = (pipeline: Pipeline) => {
        let critical = 0;
        let high = 0;
        let medium = 0;

        pipeline.trivyFindings?.forEach(f => {
            if (f.severity === 5) critical++;
            else if (f.severity === 4) high++;
            else if (f.severity === 3) medium++;
        });

        pipeline.owaspFindings?.forEach(f => {
            if (f.severity === 5) critical++;
            else if (f.severity === 4) high++;
            else if (f.severity === 3) medium++;
        });

        const score = 100 - (critical * 10 + high * 5 + medium * 2);
        return Math.max(0, score);
    };

    const getScoreStatus = (score: number) => {
        if (score >= 80) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-500/10' };
        if (score >= 60) return { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
        return { label: 'Risky', color: 'text-red-500', bg: 'bg-red-500/10' };
    };

    if (loading) return <div className="flex justify-center items-center m-10"><Loader /></div>;

    const score = report ? calculateQualityScore(report) : 0;
    const status = getScoreStatus(score);

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Pipeline Overview</h1>
                    <p className="text-slate-400 mt-1">Real-time delivery and quality metrics</p>
                    <div className="mt-4">
                        <ComponentSwitcher currentComponent={component} onComponentChange={setComponent} />
                    </div>
                </div>
                {report && (
                    <div className={`px-6 py-3 rounded-xl border border-slate-700 flex items-center gap-4 ${status.bg}`}>
                        <div>
                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Business Quality Score</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-3xl font-black ${status.color}`}>{score}</span>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${status.bg} ${status.color}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {report && (
                <AIInsightPanel
                    loading={aiLoading}
                    error={aiError}
                    summary={aiInsights?.summary}
                    recommendations={aiInsights?.recommendations}
                    onRefresh={() => fetchAiInsights(report)}
                />
            )}

            {error && <Alert type="error" message={error} />}

            {report ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SummaryCard
                            title="Status"
                            value={report.status}
                            color={report.status === 'SUCCESS' ? 'green' : 'red'}
                            icon={report.status === 'SUCCESS' ? <CheckCircle /> : <XCircle />}
                        />
                        <SummaryCard
                            title="Duration"
                            value={`${(report.duration / 1000).toFixed(2)}s`}
                            color="blue"
                            icon={<Clock />}
                        />
                        <SummaryCard
                            title="Total Vulnerabilities"
                            value={(report.trivyFindings?.length || 0) + (report.owaspFindings?.length || 0)}
                            color="purple"
                            icon={<Shield />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Quality Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                                    <span className="text-slate-400">Bugs</span>
                                    <span className="font-bold text-white">{report.sonarReport?.bugs || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                                    <span className="text-slate-400">Code Smells</span>
                                    <span className="font-bold text-white">{report.sonarReport?.codeSmells || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                                    <span className="text-slate-400">Duplication</span>
                                    <span className="font-bold text-white">{report.sonarReport?.duplication || 0}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Security Criticals</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                                    <span className="text-slate-400">Critical Risks</span>
                                    <span className="text-red-500 font-bold">
                                        {(report.trivyFindings?.filter(f => f.severity === 5).length || 0) +
                                            (report.owaspFindings?.filter(f => f.severity === 5).length || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                                    <span className="text-slate-400">High Risks</span>
                                    <span className="text-orange-500 font-bold">
                                        {(report.trivyFindings?.filter(f => f.severity === 4).length || 0) +
                                            (report.owaspFindings?.filter(f => f.severity === 4).length || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                                    <span className="text-slate-400">Medium Risks</span>
                                    <span className="text-yellow-500 font-bold">
                                        {(report.trivyFindings?.filter(f => f.severity === 3).length || 0) +
                                            (report.owaspFindings?.filter(f => f.severity === 3).length || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Pipeline Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Version (Build)</label>
                                <p className="text-white font-bold">{report.appVersion || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Commit Hash</label>
                                <p className="font-mono text-blue-400">{report.commitHash || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Executed At</label>
                                <p className="text-white">{new Date(report.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-12 text-center">
                    <p className="text-slate-400">No pipeline reports found yet.</p>
                </div>
            )}
        </div>
    );
};

export default PipelineOverview;
