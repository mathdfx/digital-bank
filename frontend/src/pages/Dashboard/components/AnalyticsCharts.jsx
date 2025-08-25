import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import numeral from 'numeral';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ... (o resto do código dos dados e CustomTooltip permanece o mesmo)

const incomeData = [
    { month: 'Apr', value: 2800 }, { month: 'May', value: 2500 }, { month: 'Jun', value: 3500 },
    { month: 'Jul', value: 4121 }, { month: 'Aug', value: 3800 }, { month: 'Sep', value: 4200 },
];
const expenseData = [
    { month: 'Apr', value: 1800 }, { month: 'May', value: 2100 }, { month: 'Jun', value: 2500 },
    { month: 'Jul', value: 3121 }, { month: 'Aug', value: 2900 }, { month: 'Sep', value: 3200 },
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return <div className="bg-black text-white p-2 rounded-md shadow-lg border border-gray-700"><p className="font-bold">{numeral(payload[0].value).format('$0,0.00')}</p></div>;
    }
    return null;
};


const Dropdown = ({ label }) => (
    <button className="flex items-center gap-1 text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-md">
        {label} <ChevronDown size={16} />
    </button>
);

export const AnalyticsCharts = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{t('income')}</h2>
                    <Dropdown label="30 days" />
                </div>
                <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={incomeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(136, 132, 216, 0.2)', strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{t('expenses')}</h2>
                    <Dropdown label="2025" />
                </div>
                <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={expenseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a0aec0' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }} />
                        <Bar dataKey="value" fill="rgba(136, 132, 216, 0.6)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};