import React from 'react';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: string | number;
        isUp: boolean;
    };
    color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend, color = 'blue' }) => {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-green-500/10 text-green-500',
        red: 'bg-red-500/10 text-red-500',
        yellow: 'bg-yellow-500/10 text-yellow-500',
        purple: 'bg-purple-500/10 text-purple-500',
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl hover:border-slate-500 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-sm font-medium ${trend.isUp ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.isUp ? '↑' : '↓'} {trend.value}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
        </div>
    );
};

export default SummaryCard;
