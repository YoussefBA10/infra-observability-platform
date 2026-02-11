import React from 'react';

interface SeverityBadgeProps {
    severity: string | number;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
    const getSeverityStyle = (sev: string | number) => {
        const s = sev.toString().toUpperCase();
        switch (s) {
            case '5':
            case 'CRITICAL':
                return 'bg-red-500/20 text-red-500 border-red-500/50';
            case '4':
            case 'HIGH':
                return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
            case '3':
            case 'MEDIUM':
                return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
            case '2':
            case 'LOW':
                return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
            default:
                return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    const getSeverityLabel = (sev: string | number) => {
        const s = sev.toString().toUpperCase();
        switch (s) {
            case '5': return 'CRITICAL';
            case '4': return 'HIGH';
            case '3': return 'MEDIUM';
            case '2': return 'LOW';
            default: return s;
        }
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityStyle(severity)}`}>
            {getSeverityLabel(severity)}
        </span>
    );
};

export default SeverityBadge;
