import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import MetricCard from '../components/dashboard/MetricCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import dashboardService from '../services/dashboard.service';
import { DashboardSummary } from '../types/dashboard';

const DashboardPage = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const summary = await dashboardService.getSummary();
      setData(summary);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
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
          <Loader size="lg" message="Loading dashboard..." />
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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">System overview and key metrics</p>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="CI/CD Pipelines"
                value="4"
                subtext="Active"
                bgColor="bg-blue-900/20"
              />
              <StatCard
                label="Success Rate"
                value="97%"
                subtext="Last 30 days"
                bgColor="bg-green-900/20"
              />
              <StatCard
                label="Infrastructure"
                value="Healthy"
                subtext="3 clusters online"
                bgColor="bg-purple-900/20"
              />
              <StatCard
                label="Alerts"
                value="3"
                subtext="Warnings"
                bgColor="bg-yellow-900/20"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">CI/CD Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data.ciCdStatus).map(([name, status]) => (
                  <div key={name} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white capitalize">{name}</h3>
                      <StatusBadge status={status.status} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400">Last Build: <span className="text-white">{status.lastBuild}</span></p>
                      <p className="text-gray-400">Duration: <span className="text-white">{status.buildDuration}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">System Monitoring</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data.monitoring).map(([name, metrics]) => (
                  <div key={name} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white capitalize">{name}</h3>
                      <StatusBadge status={metrics.status === 'up' ? 'healthy' : 'critical'} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400">Uptime: <span className="text-white">{metrics.uptime}</span></p>
                      {metrics.alerts !== undefined && (
                        <p className="text-gray-400">Alerts: <span className="text-white">{metrics.alerts}</span></p>
                      )}
                      {metrics.dashboards !== undefined && (
                        <p className="text-gray-400">Dashboards: <span className="text-white">{metrics.dashboards}</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Infrastructure Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data.infrastructure).map(([name, infra]) => (
                  <div key={name} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white capitalize">{name}</h3>
                      <StatusBadge status={infra.status} />
                    </div>
                    <div className="space-y-2 text-sm">
                      {infra.nodes !== undefined && (
                        <p className="text-gray-400">Nodes: <span className="text-white">{infra.nodes}</span></p>
                      )}
                      {infra.pods !== undefined && (
                        <p className="text-gray-400">Pods: <span className="text-white">{infra.pods}</span></p>
                      )}
                      {infra.containers !== undefined && (
                        <p className="text-gray-400">Containers: <span className="text-white">{infra.containers}</span></p>
                      )}
                      {infra.images !== undefined && (
                        <p className="text-gray-400">Images: <span className="text-white">{infra.images}</span></p>
                      )}
                      {infra.regions !== undefined && (
                        <p className="text-gray-400">Regions: <span className="text-white">{infra.regions}</span></p>
                      )}
                      {infra.instances !== undefined && (
                        <p className="text-gray-400">Instances: <span className="text-white">{infra.instances}</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
