import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LoaderCircle } from 'lucide-react';
import numeral from 'numeral';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const formatYAxis = (tickItem) => {
    return numeral(tickItem).format('$0,0');
}
export const CurrencyChart = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return; 

                const response = await axios.get('http://127.0.0.1:5000/carteira/cotacoes', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const formattedData = Object.keys(response.data).map(key => ({
                    name: key,
                    price: response.data[key]
                }));
                setData(formattedData);

            } catch (error) {
                console.error("Não foi possível ir buscar as cotações:", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchQuotes();
        const intervalId = setInterval(fetchQuotes, 15000);
        return () => clearInterval(intervalId);

    }, []); 

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-md mt-8 flex items-center justify-center h-72">
                <LoaderCircle size={32} className="animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cotações Atuais (BRL)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} tickFormatter={formatYAxis} />
                    <Tooltip 
                        cursor={{ fill: '#f5f5f5' }}
                        formatter={(value) => [numeral(value).format('$0,0.00'), 'Preço']}
                    />
                    <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
