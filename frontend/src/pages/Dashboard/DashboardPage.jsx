import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Wallet, TrendingUp, TrendingDown, MoreHorizontal, LoaderCircle, ServerCrash, Plus, Send, CreditCard, Eye, EyeOff } from "lucide-react";
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import { AnalyticsCharts } from "./components/AnalyticsCharts";

const mockTransactions = [
    { id: 1, type: 'expense', name: 'Nubank', date: '2025-08-25T10:30:00Z', amount: 25.50, icon: '🏦' },
    { id: 2, type: 'expense', name: 'iFood', date: '2025-08-24T19:00:00Z', amount: 55.90, icon: '🍔' },
    { id: 3, type: 'income', name: 'Pix Recebido', date: '2025-08-24T12:45:00Z', amount: 3500.00, icon: '💰' },
    { id: 4, type: 'expense', name: 'Farmácia São Paulo', date: '2025-08-23T18:15:00Z', amount: 75.20, icon: '⚕️' },
    { id: 5, type: 'expense', name: 'Uber', date: '2025-08-22T20:00:00Z', amount: 45.00, icon: '🚗' },
    { id: 6, type: 'expense', name: 'Amazon Brasil', date: '2025-08-22T15:30:00Z', amount: 189.90, icon: '📦' },
    { id: 7, type: 'expense', name: 'Starbucks', date: '2025-08-21T09:15:00Z', amount: 18.50, icon: '☕' },
];

const MainCard = ({ title, amount, subtitle, icon, trend, isBalance = false }) => {
    const [showBalance, setShowBalance] = useState(true);
    
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white">
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">{title}</p>
                        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isBalance && (
                        <button 
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-800 mb-1">
                        {isBalance && !showBalance ? "R$ •••••" : amount}
                    </p>
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{trend > 0 ? '+' : ''}{trend}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const QuickAction = ({ icon, label, onClick, color = "bg-gray-100" }) => (
    <button 
        onClick={onClick}
        className={`${color} hover:opacity-80 transition-all p-4 rounded-2xl flex flex-col items-center gap-2 min-w-[80px]`}
    >
        <div className="text-gray-700">{icon}</div>
        <span className="text-xs font-medium text-gray-600">{label}</span>
    </button>
);

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
        refetchInterval: 60000,
    });

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
                <LoaderCircle size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Carregando seus dados...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100">
                <ServerCrash size={48} className="text-red-400 mb-4 mx-auto" />
                <p className="text-red-600 font-semibold text-center mb-2">Ops! Algo deu errado</p>
                <p className="text-red-400 text-sm text-center">{error.message}</p>
            </div>
        </div>
    );

    const totalBalance = data.saldo_brl + data.cryptoTotal;
    const monthlySpending = 3450.65; // Mock data
    const monthlySavings = data.cryptoTotal;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Bem-vindo de volta! 👋
                    </h1>
                    <p className="text-gray-600">Aqui está um resumo da sua situação financeira</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {/* Balance Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <MainCard
                                title="Saldo Total"
                                amount={numeral(totalBalance).format('R$ 0,0.00')}
                                icon={<Wallet size={20} />}
                                trend={+28}
                                isBalance={true}
                            />
                            <MainCard
                                title="Gastos do Mês"
                                amount={numeral(monthlySpending).format('R$ 0,0.00')}
                                icon={<TrendingDown size={20} />}
                                trend={-12}
                            />
                            <MainCard
                                title="Investimentos"
                                subtitle="Em criptomoedas"
                                amount={numeral(monthlySavings).format('R$ 0,0.00')}
                                icon={<TrendingUp size={20} />}
                                trend={+15}
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                            <AnalyticsCharts />
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Transações Recentes</h2>
                                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                                    Ver todas
                                </button>
                            </div>
                            <div className="space-y-4">
                                {mockTransactions.slice(0, 5).map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-lg">
                                                {transaction.icon}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{transaction.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                                                {transaction.type === 'income' ? '+' : '-'} {numeral(transaction.amount).format('R$ 0,0.00')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Card Section */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Meus Cartões</h2>
                                    <button className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                                        <Plus size={16} className="text-blue-600" />
                                    </button>
                                </div>
                                
                                {/* Credit Card */}
                                <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-3xl p-6 text-white mb-6 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="text-sm font-medium opacity-90">VISA</div>
                                        <div className="w-8 h-8">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                                                <path d="M1 9l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <div className="text-3xl font-bold mb-2">
                                            {numeral(data.saldo_brl).format('R$ 0,0.00')}
                                        </div>
                                        <div className="text-lg font-mono tracking-wider opacity-90">
                                            •••• •••• 1287 2342
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm opacity-75">
                                            Expira em 05/29
                                        </div>
                                        <div className="opacity-60">
                                            <svg width="32" height="20" viewBox="0 0 32 20" fill="currentColor">
                                                <path d="M16 20c8.837 0 16-7.163 16-16S24.837-12 16-12 0 7.163 0 16s7.163 16 16 16z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Decorative elements */}
                                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white opacity-5 rounded-full"></div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex justify-between gap-3 mb-6">
                                    <QuickAction 
                                        icon={<Send size={20} />} 
                                        label="Enviar" 
                                        color="bg-blue-50"
                                    />
                                    <QuickAction 
                                        icon={<CreditCard size={20} />} 
                                        label="Pagar" 
                                        color="bg-green-50"
                                    />
                                    <QuickAction 
                                        icon={<Plus size={20} />} 
                                        label="Depositar" 
                                        color="bg-purple-50"
                                    />
                                    <QuickAction 
                                        icon={<TrendingUp size={20} />} 
                                        label="Investir" 
                                        color="bg-orange-50"
                                    />
                                </div>
                            </div>

                            {/* Recent Contacts */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-bold text-gray-800">Contatos Recentes</h2>
                                    <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                                        <Plus size={16} className="text-gray-600" />
                                    </button>
                                </div>
                                
                                <div className="flex justify-between">
                                    {['Ana', 'João', 'Maria', 'Pedro', 'Carla'].map((name, index) => (
                                        <div key={name} className="flex flex-col items-center gap-2 cursor-pointer group">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                                                {name[0]}
                                            </div>
                                            <span className="text-xs text-gray-600 font-medium">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};