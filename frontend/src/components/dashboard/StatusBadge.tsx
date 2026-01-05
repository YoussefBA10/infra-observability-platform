import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'critical' | 'running' | 'idle' | 'building' | 'success' | 'failed' | 'up' | 'down' | 'stopped' | 'error';
  label?: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const statusConfig = {
    healthy: { bg: 'bg-green-900/30', text: 'text-green-400', icon: CheckCircle, displayName: 'Healthy' },
    warning: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', icon: AlertCircle, displayName: 'Warning' },
    critical: { bg: 'bg-red-900/30', text: 'text-red-400', icon: XCircle, displayName: 'Critical' },
    running: { bg: 'bg-green-900/30', text: 'text-green-400', icon: CheckCircle, displayName: 'Running' },
    idle: { bg: 'bg-gray-900/30', text: 'text-gray-400', icon: Clock, displayName: 'Idle' },
    building: { bg: 'bg-blue-900/30', text: 'text-blue-400', icon: Clock, displayName: 'Building' },
    success: { bg: 'bg-green-900/30', text: 'text-green-400', icon: CheckCircle, displayName: 'Success' },
    failed: { bg: 'bg-red-900/30', text: 'text-red-400', icon: XCircle, displayName: 'Failed' },
    up: { bg: 'bg-green-900/30', text: 'text-green-400', icon: CheckCircle, displayName: 'Up' },
    down: { bg: 'bg-red-900/30', text: 'text-red-400', icon: XCircle, displayName: 'Down' },
    stopped: { bg: 'bg-gray-900/30', text: 'text-gray-400', icon: Clock, displayName: 'Stopped' },
    error: { bg: 'bg-red-900/30', text: 'text-red-400', icon: XCircle, displayName: 'Error' },
  };

  const config = statusConfig[status] || statusConfig['idle'];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label || config.displayName}</span>
    </div>
  );
};

export default StatusBadge;