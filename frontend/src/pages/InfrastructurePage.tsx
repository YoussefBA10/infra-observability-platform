import { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import dashboardService from '../services/dashboard.service';

const InfrastructurePage = () => {
  const [summary, setSummary] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [containers, setContainers] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [risks, setRisks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [sum, serv, cont, nodeData, riskData] = await Promise.all([
        dashboardService.getInfrastructureSummary(),
        dashboardService.getInfrastructureServices(),
        dashboardService.getInfrastructureContainers(),
        dashboardService.getInfrastructureNodes(),
        dashboardService.getInfrastructureRisks()
      ]);

      setSummary(sum);
      setServices(serv);
      setContainers(cont);
      setNodes(nodeData);
      setRisks(riskData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load infrastructure data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s refresh for infra
    return () => clearInterval(interval);
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" message="Loading infrastructure data..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="justify-between items-end hidden md:flex">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Infrastructure Monitoring</h1>
          <p className="text-gray-400">Operational health and resource telemetry</p>
        </div>
        {summary && (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Overall Health:</span>
            <StatusBadge status={summary.health.toLowerCase()} />
          </div>
        )}
      </div>

      {/* Overview Row */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Health" value={summary.health} bgColor={summary.health === 'Healthy' ? 'bg-green-900/20' : 'bg-red-900/20'} />
          <StatCard label="Services" value={`${summary.servicesRunning}/${summary.servicesTotal}`} />
          <StatCard label="Containers" value={summary.containersRunning.toString()} />
          <StatCard label="Incidents (24h)" value={summary.incidentsLast24h.toString()} bgColor={summary.incidentsLast24h > 0 ? 'bg-red-900/20' : 'bg-green-900/20'} />
        </div>
      )}

      {/* Service Groups & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Service Groups</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3">Group</th>
                  <th className="px-6 py-3">Services</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {services.map((group, idx) => (
                  <tr key={idx} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{group.group}</td>
                    <td className="px-6 py-4 text-gray-300">{group.services.join(', ')}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={group.status.toLowerCase()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Infrastructure Risk Summary</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 min-h-[200px]">
            {risks.length === 0 ? (
              <p className="text-gray-400 italic">No infrastructure risks detected.</p>
            ) : (
              <ul className="space-y-3">
                {risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="text-red-500 mt-1">●</span>
                    {risk}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Running Containers */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Running Containers</h2>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3">Container</th>
                  <th className="px-6 py-3">Node</th>
                  <th className="px-6 py-3">Service Group</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">CPU</th>
                  <th className="px-6 py-3">Memory</th>
                  <th className="px-6 py-3">Uptime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {containers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 font-mono text-blue-400">{c.name}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{c.node}</td>
                    <td className="px-6 py-4 text-gray-400">{c.service}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status === 'running' ? 'healthy' : 'critical'} />
                    </td>
                    <td className="px-6 py-4 text-gray-300">{c.cpu}</td>
                    <td className="px-6 py-4 text-gray-300">{c.memory}</td>
                    <td className="px-6 py-4 text-gray-400">{c.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Compute Nodes */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Compute Nodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node, idx) => (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{node.hostname}</h3>
                  <p className="text-xs text-gray-400">Physical Host</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">CPU Usage</span>
                    <span className="text-white">{node.cpuUsage}</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: node.cpuUsage.includes('N/A') ? '0%' : node.cpuUsage }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">RAM Allocation</span>
                    <span className="text-white">{node.memoryUsed} / {node.memoryTotal}</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full"
                      style={{ width: node.memoryUsed.includes('N/A') ? '0%' : node.memoryUsed }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Disk Space</span>
                    <span className="text-white">{node.diskUsage} utilized</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full"
                      style={{ width: node.diskUsage.includes('N/A') ? '0%' : node.diskUsage }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfrastructurePage;
