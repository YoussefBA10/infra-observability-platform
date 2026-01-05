import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import dashboardService from '../services/dashboard.service';
import { InfrastructureResponse } from '../types/dashboard';

const InfrastructurePage = () => {
  const [data, setData] = useState<InfrastructureResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const infraData = await dashboardService.getInfrastructure();
      setData(infraData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load infrastructure data');
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
          <Loader size="lg" message="Loading infrastructure data..." />
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
          <h1 className="text-3xl font-bold text-white mb-2">Infrastructure</h1>
          <p className="text-gray-400">Kubernetes clusters, containers, and nodes</p>
        </div>

        {data && (
          <>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Kubernetes Clusters</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.clusters.map((cluster) => (
                  <div key={cluster.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{cluster.name}</h3>
                      <StatusBadge status={cluster.status} />
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Nodes:</span>
                        <span className="text-white font-medium">{cluster.nodes}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Pods:</span>
                        <span className="text-white font-medium">{cluster.pods}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">CPU Usage:</span>
                        <span className="text-white font-medium">{cluster.cpuUsage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Memory Usage:</span>
                        <span className="text-white font-medium">{cluster.memoryUsage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Running Containers</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.containers.map((container) => {
                  const statusMap = container.status === 'running' ? 'healthy' : container.status === 'error' ? 'critical' : 'warning';
                  return (
                    <div key={container.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white">{container.name}</h3>
                        <StatusBadge status={statusMap} />
                      </div>

                      <div className="space-y-2 text-xs text-gray-400">
                        <p>Image: <span className="text-gray-300 font-mono">{container.image}</span></p>
                        <p>Uptime: <span className="text-gray-300">{container.uptime}</span></p>
                        <p>Restarts: <span className="text-gray-300">{container.restarts}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Cluster Nodes</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.nodes.map((node) => (
                  <div key={node.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white">{node.name}</h3>
                      <StatusBadge status={node.status} />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">CPU:</span>
                        <span className="text-white">{node.cpuUsage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Memory:</span>
                        <span className="text-white">{node.memoryUsage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Disk:</span>
                        <span className="text-white">{node.diskUsage}</span>
                      </div>
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

export default InfrastructurePage;
