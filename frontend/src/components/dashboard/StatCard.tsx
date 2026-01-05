import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

const StatCard = ({ label, value, subtext, icon, bgColor = 'bg-blue-900/20' }: StatCardProps) => {
  return (
    <div className={`${bgColor} border border-gray-700 rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        {icon && <div className="text-2xl opacity-50">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;