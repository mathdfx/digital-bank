import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import { fetchHistoricalData } from '../../../services/api';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-900 text-white p-3 rounded-md shadow-lg border border-gray-700">
                <p className="text-sm font-semibold">{format(new Date(data.date), 'dd/MM/yyyy HH:mm')}</p>
                <p className="font-bold text-lg">{numeral(data.price).format('$0,0.00')}</p>
            </div>
        );
    }
    return null;
};

const TimeRangeButton = ({ range, label, activeRange, onClick }) => (
    <button
        onClick={() => onClick(range)}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
            activeRange === range
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
);

export const CurrencyPriceChart = ({ currency }) => {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(7); 

    useEffect(() => {
        const loadChartData = async () => {
            if (!currency) return;
            setLoading(true);
            const historicalData = await fetchHistoricalData(currency, timeRange);
            
            if (historicalData) {
                const formattedData = historicalData.map(item => ({
                    date: item[0],
                    price: item[1]
                }));
                setChartData(formattedData);
            } else {
                setChartData([]);
            }
            setLoading(false);
        };

        loadChartData();
    }, [currency, timeRange]);

    const formatXAxis = (time) => {
        if (timeRange === 1) {
            return format(new Date(time), 'HH:mm'); 
        }
        return format(new Date(time), 'dd/MM');
    };

    return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                    {t('price_of')} {currency}
                </h3>
                <div className="flex items-center gap-2">
                    <TimeRangeButton range={1} label="1D" activeRange={timeRange} onClick={setTimeRange} />
                    <TimeRangeButton range={7} label="7D" activeRange={timeRange} onClick={setTimeRange} />
                    <TimeRangeButton range={30} label="30D" activeRange={timeRange} onClick={setTimeRange} />
                </div>
            </div>
            <div className="flex-grow">
                {loading ? (
                    <div className="flex items-center justify-center h-full"><p className="text-gray-400">Carregando gráfico...</p></div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full"><p className="text-gray-400">{t('historical_data_not_available')}</p></div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tickFormatter={formatXAxis} stroke="#8884d8" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                            <YAxis domain={['dataMin', 'dataMax']} stroke="#8884d8" tick={{ fill: '#a0aec0', fontSize: 12 }} tickFormatter={(value) => numeral(value).format('$0,0a')} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
