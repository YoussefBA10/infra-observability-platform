import { useState, useEffect } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import dashboardService from '../services/dashboard.service';
import { MonitoringResponse } from '../types/dashboard';
import { AlertCircle } from 'lucide-react';

const MonitoringPage = () => {
  const [data, setData] = useState<MonitoringResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const monitoringData = await dashboardService.getMonitoring();
      setData(monitoringData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load monitoring data');
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" message="Loading monitoring data..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Monitoring</h1>
        <p className="text-gray-400">Real-time system metrics and alerts</p>
      </div>

      {data && (
        <>
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.metrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  title={metric.name}
                  value={metric.value}
                  status={metric.status}
                  threshold={metric.threshold}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Active Alerts</h2>
            {data.alerts.length > 0 ? (
              <div className="space-y-3">
                {data.alerts.map((alert) => {
                  const isCritical = alert.severity === 'critical';
                  const isWarning = alert.severity === 'warning';
                  const bgClass = isCritical ? 'bg-red-900/20 border-red-800' : isWarning ? 'bg-yellow-900/20 border-yellow-800' : 'bg-blue-900/20 border-blue-800';
                  const iconClass = isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-blue-400';
                  const textClass = isCritical ? 'text-red-300' : isWarning ? 'text-yellow-300' : 'text-blue-300';
                  const badgeStatus = isCritical ? 'critical' : isWarning ? 'warning' : 'healthy';
                  return (
                    <div key={alert.id} className={`border rounded-lg p-4 flex items-start gap-3 ${bgClass}`}>
                      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
                      <div className="flex-1">
                        <p className="font-medium text-white">{alert.title}</p>
                        <p className={`text-xs mt-1 ${textClass}`}>{alert.timestamp}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge status={badgeStatus} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400">No active alerts</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MonitoringPage;
