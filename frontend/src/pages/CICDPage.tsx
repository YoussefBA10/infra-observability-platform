import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import ChatWidget from '../components/chat/ChatWidget';
import dashboardService from '../services/dashboard.service';
import { CICDResponse } from '../types/dashboard';

const CICDPage = () => {
  const [data, setData] = useState<CICDResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const cicdData = await dashboardService.getCICDStatus();
      setData(cicdData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CI/CD data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="lg" message="Loading CI/CD data..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Delivery Insights</h1>
          <p className="text-gray-400">Executive CI/CD Pipeline Intelligence</p>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Pipelines"
                value={data.summary.totalPipelines}
                bgColor="bg-blue-900/20"
              />
              <StatCard
                label="Successful"
                value={data.summary.successCount}
                bgColor="bg-green-900/20"
              />
              <StatCard
                label="Failed"
                value={data.summary.failedCount}
                bgColor="bg-red-900/20"
              />
              <StatCard
                label="Running"
                value={data.summary.runningCount}
                bgColor="bg-blue-900/20"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Pipeline Status</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.pipelines.map((pipeline) => (
                  <div key={pipeline.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{pipeline.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">Last run: {pipeline.lastRun}</p>
                      </div>
                      <StatusBadge status={pipeline.status} />
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white font-medium">{pipeline.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-white font-medium">{pipeline.successRate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Floating AI Delivery Agent */}
        <ChatWidget />
      </div>
    </Layout>
  );
};

export default CICDPage;
