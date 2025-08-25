import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query'; // Importa useQuery
import axios from 'axios';
import { Wallet, TrendingUp, TrendingDown, MoreHorizontal, LoaderCircle, ServerCrash } from "lucide-react";
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import { TransactionList } from "./components/TransactionList";
import { SidePanel } from "./components/SidePanel";
import { AnalyticsCharts } from "./components/AnalyticsCharts";

// Transações Mock com nomes brasileiros
const mockTransactions = [
    { id: 1, type: 'expense', name: 'Uber Viagem', date: '2025-08-25T10:30:00Z', amount: 25.50 },
    { id: 2, type: 'expense', name: 'Burger King', date: '2025-08-24T19:00:00Z', amount: 55.90 },
    { id: 3, type: 'income', name: 'Salário', date: '2025-08-24T12:45:00Z', amount: 3500.00 },
    { id: 4, type: 'expense', name: 'DrogaSil', date: '2025-08-23T18:15:00Z', amount: 75.20 },
    { id: 5, type: 'expense', name: 'Ingresso Cinema', date: '2025-08-22T20:00:00Z', amount: 45.00 },
];

const SummaryCard = ({ icon, title, amount }) => (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md flex-1">
        <div className="flex justify-between items-start mb-4">
            <div className="bg-gray-700 p-3 rounded-full">{icon}</div>
            <button className="text-gray-400 hover:text-gray-200"><MoreHorizontal size={20} /></button>
        </div>
        <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{amount}</p>
        </div>
    </div>
);

// Função para buscar os dados
const fetchDashboardData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token não encontrado.');

    const [saldosRes, cotacoesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/carteira/saldos', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/carteira/cotacoes', { headers: { Authorization: `Bearer ${token}` } })
    ]);
    
    const cryptoTotal = saldosRes.data.ativos.reduce((acc, ativo) => {
        const cotacao = cotacoesRes.data[ativo.moeda];
        return acc + (ativo.quantidade * cotacao);
    }, 0);

    return { ...saldosRes.data, cryptoTotal };
};

export const DashboardPage = () => {
    const { t } = useTranslation();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboardData'],
        queryFn: fetchDashboardData,
        refetchInterval: 60000, // Atualiza a cada 60 segundos
    });

    if (isLoading) return <div className="flex items-center justify-center h-full"><LoaderCircle size={48} className="animate-spin text-purple-500" /></div>;
    if (isError) return <div className="flex flex-col items-center justify-center h-full bg-red-900/20 p-4 rounded-lg"><ServerCrash size={48} className="text-red-400 mb-4" /><p className="text-red-300 font-semibold">Oops!</p><p className="text-red-400 text-sm">{error.message}</p></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-white">{t('welcome_back')}</h1>
                <p className="text-gray-400">{t('dashboard')}</p>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-6">
                    <SummaryCard icon={<Wallet size={24} className="text-green-400" />} title={t('total_balance')} amount={numeral(data.saldo_brl).format('$0,0.00')} />
                    <SummaryCard icon={<TrendingDown size={24} className="text-red-400" />} title={t('total_spending')} amount="$ 3450.65" />
                    <SummaryCard icon={<TrendingUp size={24} className="text-blue-400" />} title={t('crypto_savings')} amount={numeral(data.cryptoTotal).format('$0,0.00')} />
                </div>

                <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <AnalyticsCharts />
                    </div>
                    <div>
                        <TransactionList transactions={mockTransactions} />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <SidePanel userBalance={data.saldo_brl} />
            </div>
        </div>
    );
};