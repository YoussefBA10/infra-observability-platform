import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface TrendChartProps {
    data: any[];
    dataKey: string;
    color?: string;
    type?: 'line' | 'area';
    height?: number;
}

const TrendChart: React.FC<TrendChartProps> = ({
    data,
    dataKey,
    color = '#3b82f6',
    type = 'line',
    height = 300
}) => {
    return (
        <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                {type === 'line' ? (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickFormatter={(str) => new Date(str).toLocaleDateString()}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#1e293b' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                ) : (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickFormatter={(str) => new Date(str).toLocaleDateString()}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            fillOpacity={0.1}
                            fill={color}
                            strokeWidth={3}
                        />
                    </AreaChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;
