import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import numeral from 'numeral';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const incomeData = [
    { month: 'Jan', value: 4500, label: 'Jan' }, 
    { month: 'Fev', value: 3800, label: 'Fev' }, 
    { month: 'Mar', value: 5200, label: 'Mar' },
    { month: 'Abr', value: 4800, label: 'Abr' }, 
    { month: 'Mai', value: 5500, label: 'Mai' }, 
    { month: 'Jun', value: 6200, label: 'Jun' },
    { month: 'Jul', value: 5900, label: 'Jul' }, 
    { month: 'Ago', value: 6556, label: 'Ago' },
];

const expenseData = [
    { month: 'Jan', value: 2800, label: 'Jan' }, 
    { month: 'Fev', value: 3200, label: 'Fev' }, 
    { month: 'Mar', value: 2900, label: 'Mar' },
    { month: 'Abr', value: 3400, label: 'Abr' }, 
    { month: 'Mai', value: 3100, label: 'Mai' }, 
    { month: 'Jun', value: 3600, label: 'Jun' },
    { month: 'Jul', value: 3300, label: 'Jul' }, 
    { month: 'Ago', value: 3450, label: 'Ago' },
];

const savingsData = [
    { month: 'Jan', value: 800 }, 
    { month: 'Fev', value: 1200 }, 
    { month: 'Mar', value: 1800 },
    { month: 'Abr', value: 1400 }, 
    { month: 'Mai', value: 2100 }, 
    { month: 'Jun', value: 2800 },
    { month: 'Jul', value: 3200 }, 
    { month: 'Ago', value: 2950 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                <p className="text-lg font-bold text-gray-800">
                    {numeral(value).format('R$ 0,0.00')}
                </p>
                <div className="w-3 h-3 rounded-full bg-blue-500 absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>
            </div>
        );
    }
    return null;
};

const ChartCard = ({ title, children, trend, trendValue, timeframe, icon }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
            </div>
            <button className="flex items-center gap-1 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors">
                {timeframe} <ChevronDown size={16} />
            </button>
        </div>
        <div className="h-48">
            {children}
        </div>
    </div>
);

export const AnalyticsCharts = () => {
    const { t } = useTranslation();

    return (
        <>
            {/* Income Chart */}
            <ChartCard 
                title="Receitas" 
                trend="up" 
                trendValue="+12.5%"
                timeframe="Últimos 8 meses"
                icon="💰"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={incomeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="label" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            fill="url(#incomeGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Expenses Chart */}
            <ChartCard 
                title="Gastos" 
                trend="down" 
                trendValue="-3.2%"
                timeframe="Últimos 8 meses"
                icon="💳"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <XAxis 
                            dataKey="label" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            dataKey="value" 
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Savings Chart - Spans both columns */}
            <div className="xl:col-span-2">
                <ChartCard 
                    title="Evolução dos Investimentos" 
                    trend="up" 
                    trendValue="+28.4%"
                    timeframe="Últimos 8 meses"
                    icon="📈"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="month" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fill="url(#savingsGradient)"
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Summary Cards */}
            <div className="xl:col-span-2 grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white text-lg">💰</span>
                        </div>
                        <div className="text-green-600 text-sm font-medium bg-green-200 px-2 py-1 rounded-full">
                            +12.5%
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-green-800 mb-1">R$ 6.556,73</div>
                    <div className="text-green-600 text-sm font-medium">Receita Total</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white text-lg">💎</span>
                        </div>
                        <div className="text-blue-600 text-sm font-medium bg-blue-200 px-2 py-1 rounded-full">
                            +28.4%
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-800 mb-1">R$ 2.950,00</div>
                    <div className="text-blue-600 text-sm font-medium">Investimentos</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white text-lg">📊</span>
                        </div>
                        <div className="text-purple-600 text-sm font-medium bg-purple-200 px-2 py-1 rounded-full">
                            47.3%
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-800 mb-1">R$ 3.106,73</div>
                    <div className="text-purple-600 text-sm font-medium">Economia Mensal</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white text-lg">🎯</span>
                        </div>
                        <div className="text-orange-600 text-sm font-medium bg-orange-200 px-2 py-1 rounded-full">
                            Meta: 80%
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-800 mb-1">R$ 10.000</div>
                    <div className="text-orange-600 text-sm font-medium">Meta de Investimento</div>
                </div>
            </div>
        </>
    );
};