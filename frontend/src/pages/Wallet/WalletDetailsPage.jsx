import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoaderCircle, ServerCrash, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Eye, EyeOff, Copy, Plus } from 'lucide-react';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const fetchWalletData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token não encontrado.');

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentUser = decodedToken.sub;

    const [saldosRes, cotacoesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/carteira/saldos', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/carteira/cotacoes', { headers: { Authorization: `Bearer ${token}` } })
    ]);

    const ativosWithValue = saldosRes.data.ativos.map(ativo => ({
        ...ativo,
        valor_brl: ativo.quantidade * cotacoesRes.data[ativo.moeda],
        cotacao: cotacoesRes.data[ativo.moeda]
    }));

    return {
        ...saldosRes.data,
        ativos: ativosWithValue,
        usuario: currentUser
    };
};

const currencyIcons = {
    'BTC': '₿',
    'USD': '$', 
    'EUR': '€',
    'GBP': '£',
    'CNY': '¥'
};

const currencyColors = {
    'BTC': 'from-orange-400 to-orange-600',
    'USD': 'from-green-400 to-green-600', 
    'EUR': 'from-blue-400 to-blue-600',
    'GBP': 'from-purple-400 to-purple-600',
    'CNY': 'from-red-400 to-red-600'
};

const AssetCard = ({ ativo }) => {
    const icon = currencyIcons[ativo.moeda] || '💰';
    const colorClass = currencyColors[ativo.moeda] || 'from-gray-400 to-gray-600';
    
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center text-white text-xl font-bold`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{ativo.moeda}</h3>
                        <p className="text-sm text-gray-500">{ativo.quantidade.toFixed(8)}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">{numeral(ativo.valor_brl).format('R$ 0,0.00')}</p>
                    <p className="text-sm text-gray-500">@ {numeral(ativo.cotacao).format('R$ 0,0.00')}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-sm text-green-600 font-medium">
                    ↗ +2.5% hoje
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                    Negociar
                </button>
            </div>
        </div>
    );
};

const TransactionItem = ({ tx, currentUser }) => {
    const isSent = tx.remetente === currentUser;
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSent ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {isSent ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">
                        {isSent ? `Enviado para ${tx.destinatario}` : `Recebido de ${tx.remetente}`}
                    </p>
                    <p className="text-sm text-gray-500">
                        {format(new Date(tx.data), "dd MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-lg font-bold ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                    {isSent ? '-' : '+'} {numeral(tx.valor).format('R$ 0,0.00')}
                </p>
                <p className="text-sm text-gray-500">PIX</p>
            </div>
        </div>
    );
};

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const WalletDetailsPage = () => {
    const { t } = useTranslation();
    const [showBalance, setShowBalance] = React.useState(true);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['walletDetails'],
        queryFn: fetchWalletData,
        refetchInterval: 30000,
    });

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <LoaderCircle size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Carregando sua carteira...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center bg-white rounded-3xl p-8 shadow-sm border">
                <ServerCrash size={48} className="text-red-400 mb-4 mx-auto" />
                <p className="text-red-600 font-semibold mb-2">Ops! Algo deu errado</p>
                <p className="text-gray-500 text-sm">{error.message}</p>
            </div>
        </div>
    );

    const totalCryptoValue = data.ativos.reduce((acc, ativo) => acc + ativo.valor_brl, 0);
    const totalWalletValue = data.saldo_brl + totalCryptoValue;

    const chartData = [
        { name: 'Real (BRL)', value: data.saldo_brl },
        ...data.ativos.map(ativo => ({
            name: ativo.moeda,
            value: ativo.valor_brl
        }))
    ].filter(d => d.value > 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-600 rounded-2xl flex items-center justify-center">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Minha Carteira</h1>
                            <p className="text-gray-600">Gerencie seus ativos e investimentos</p>
                        </div>
                    </div>
                </div>

                {/* Balance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-blue-200 text-sm mb-2">Patrimônio Total</p>
                                <p className="text-4xl font-bold mb-4">
                                    {showBalance ? numeral(totalWalletValue).format('R$ 0,0.00') : 'R$ •••••••'}
                                </p>
                                <div className="flex items-center gap-2 text-green-300">
                                    <TrendingUp size={16} />
                                    <span className="text-sm">+12.5% este mês</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="w-10 h-10 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                                <button className="w-10 h-10 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex gap-3">
                            <button className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-3 text-center hover:bg-white/20 transition-colors">
                                <Plus size={20} className="mx-auto mb-1" />
                                <span className="text-sm font-medium">Depositar</span>
                            </button>
                            <button className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-3 text-center hover:bg-white/20 transition-colors">
                                <ArrowUpRight size={20} className="mx-auto mb-1" />
                                <span className="text-sm font-medium">Enviar</span>
                            </button>
                            <button className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-3 text-center hover:bg-white/20 transition-colors">
                                <TrendingUp size={20} className="mx-auto mb-1" />
                                <span className="text-sm font-medium">Investir</span>
                            </button>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-5 rounded-full"></div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-5 rounded-full"></div>
                    </div>
                    
                    {/* Portfolio Distribution */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição</h3>
                        {chartData.length > 0 ? (
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => numeral(value).format('R$ 0,0.00')} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-gray-400">
                                Sem dados para exibir
                            </div>
                        )}
                        <div className="space-y-2 mt-4">
                            {chartData.slice(0, 3).map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-3 h-3 rounded-full" 
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        ></div>
                                        <span className="text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-800">
                                        {((item.value / totalWalletValue) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Assets List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Meus Ativos</h2>
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition-colors">
                                <Plus size={16} />
                                Comprar Mais
                            </button>
                        </div>
                        
                        {/* BRL Balance */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                                        R$
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Real Brasileiro</h3>
                                        <p className="text-sm text-gray-500">Saldo em conta</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-800">{numeral(data.saldo_brl).format('R$ 0,0.00')}</p>
                                    <p className="text-sm text-gray-500">Moeda base</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Other Assets */}
                        <div className="space-y-4">
                            {data.ativos.map(ativo => (
                                <AssetCard key={ativo.moeda} ativo={ativo} />
                            ))}
                        </div>
                        
                        {data.ativos.length === 0 && (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Nenhum ativo encontrado</h3>
                                <p className="text-gray-600 mb-6">Comece a investir para diversificar seu portfólio</p>
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors">
                                    Fazer Primeiro Investimento
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Transactions History */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Últimas Transações</h2>
                                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                                    Ver todas
                                </button>
                            </div>
                            
                            {data.transacoes && data.transacoes.length > 0 ? (
                                <div className="space-y-2">
                                    {data.transacoes.map((tx, index) => (
                                        <TransactionItem key={index} tx={tx} currentUser={data.usuario} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-xl">📊</span>
                                    </div>
                                    <p className="text-gray-500 text-sm">Nenhuma transação recente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};