import { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import ChatWidget from '../components/chat/ChatWidget';
import dashboardService from '../services/dashboard.service';
import { DashboardSummary } from '../types/dashboard';

const DashboardPage = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [infra, setInfra] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [summaryData, infraData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getInfrastructureSummary()
      ]);
      setData(summaryData);
      setInfra(infraData);
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" message="Loading dashboard..." />
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
        <h1 className="text-3xl font-bold text-white mb-2">Executive Overview</h1>
        <p className="text-gray-400">Platform stability and business continuity signals</p>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Availability"
              value={data.weeklyKpis.availability}
              subtext="System Uptime"
              bgColor="bg-blue-900/20"
            />
            <StatCard
              label="Infrastructure CPU"
              value={`${infra?.cpuUsage.toFixed(1) || 0}%`}
              subtext="Aggregated Load"
              bgColor={infra?.cpuUsage > 80 ? 'bg-red-900/20' : 'bg-green-900/20'}
            />
            <StatCard
              label="Incidents"
              value={infra?.incidentsLast24h.toString() || data.weeklyKpis.incidents.toString()}
              subtext="Active Alerts"
              bgColor={infra?.incidentsLast24h > 0 ? 'bg-red-900/20' : 'bg-red-900/20'}
            />
            <StatCard
              label="Pod Health"
              value={infra?.health.toUpperCase() || 'STABLE'}
              subtext="Readiness Signal"
              bgColor={infra?.health === 'Critical' ? 'bg-red-900/20' : 'bg-purple-900/20'}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Platform Readiness</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(data.platformHealth).map(([name, status]) => (
                <div key={name} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-white capitalize">
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <StatusBadge status={status === 'up' || status === 'healthy' || status === 'operational' || status === 'stable' ? 'healthy' : 'critical'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Delivery Pipeline</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-700">
                  {Object.entries(data.deliveryStatus).map(([name, status]) => (
                    <div key={name} className="p-4 flex items-center justify-between">
                      <span className="text-gray-300 font-medium capitalize">
                        {name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <StatusBadge status={status === 'idle' ? 'healthy' : status === 'building' ? 'warning' : 'critical'} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Operational Capacity</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Status</p>
                    <p className="text-2xl font-bold text-white capitalize">{data.capacity.status}</p>
                  </div>
                  <StatusBadge status={data.capacity.status === 'sufficient' ? 'healthy' : 'warning'} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-gray-500 text-xs mb-1">Active Services</p>
                    <p className="text-xl font-semibold text-white">{data.capacity.activeServices}</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-gray-500 text-xs mb-1">Stopped</p>
                    <p className="text-xl font-semibold text-white">{data.capacity.stoppedServices}</p>
                  </div>
                </div>

                {data.capacity.activeContainerNames && data.capacity.activeContainerNames.length > 0 && (
                  <div className="mt-2 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Live Service Fleet</p>
                    <div className="flex flex-wrap gap-2">
                      {data.capacity.activeContainerNames
                        .filter(name => name !== 'cadvisor')
                        .map(name => (
                          <span key={name} className="px-2 py-1 bg-blue-900/20 text-blue-400 text-[10px] font-bold rounded border border-blue-800/30 uppercase tracking-tighter">
                            {name}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating AI Monitoring Agent */}
      <ChatWidget />
    </div>
  );
};

export default DashboardPage;
