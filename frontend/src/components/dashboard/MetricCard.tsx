import React from 'react';
import StatusBadge from './StatusBadge';

interface MetricCardProps {
  title: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const MetricCard = ({ title, value, status, threshold, icon, trend }: MetricCardProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        {icon && <div className="text-blue-400">{icon}</div>}
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status={status} />
        {threshold && (
          <p className="text-xs text-gray-500">Threshold: {threshold}</p>
        )}
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className={`text-xs font-medium ${
            trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-gray-400'
          }`}>
            {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MetricCard;