import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoaderCircle, ServerCrash, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
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
const AssetItem = ({ ativo }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
        <div>
            <p className="font-bold text-lg text-white">{ativo.moeda}</p>
            <p className="text-sm text-gray-400">{ativo.quantidade.toFixed(8)}</p>
        </div>
        <div className="text-right">
            <p className="font-semibold text-white">{numeral(ativo.valor_brl).format('$0,0.00')}</p>
            <p className="text-xs text-gray-500">@ {numeral(ativo.cotacao).format('$0,0.00')}</p>
        </div>
    </div>
);

const TransactionItem = ({ tx, currentUser }) => {
    const isSent = tx.remetente === currentUser;
    const { t } = useTranslation();

    return (
        <li className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isSent ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
                    {isSent ? <ArrowUpRight size={16} className="text-red-400" /> : <ArrowDownLeft size={16} className="text-green-400" />}
                </div>
                <div>
                    <p className="font-semibold text-white">
                        {isSent ? `${t('send')} para ${tx.destinatario}` : `${t('receive')} de ${tx.remetente}`}
                    </p>
                    <p className="text-xs text-gray-500">{format(new Date(tx.data), "dd MMM, yyyy 'às' HH:mm", { locale: ptBR })}</p>
                </div>
            </div>
            <p className={`font-semibold ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                {isSent ? '-' : '+'} {numeral(tx.valor).format('$0,0.00')}
            </p>
        </li>
    );
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

export const WalletDetailsPage = () => {
    const { t } = useTranslation();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['walletDetails'],
        queryFn: fetchWalletData,
        refetchInterval: 30000,
    });

    if (isLoading) return <div className="flex items-center justify-center h-full"><LoaderCircle size={48} className="animate-spin text-purple-500" /></div>;
    if (isError) return <div className="flex flex-col items-center justify-center h-full bg-red-900/20 p-4 rounded-lg"><ServerCrash size={48} className="text-red-400 mb-4" /><p className="text-red-300 font-semibold">Oops!</p><p className="text-red-400 text-sm">{error.message}</p></div>;

    const totalCryptoValue = data.ativos.reduce((acc, ativo) => acc + ativo.valor_brl, 0);
    const totalWalletValue = data.saldo_brl + totalCryptoValue;

    const chartData = [
        { name: 'BRL', value: data.saldo_brl },
        ...data.ativos.map(ativo => ({
            name: ativo.moeda,
            value: ativo.valor_brl
        }))
    ].filter(d => d.value > 0); 

    return (
        <div>
            <h1 className="text-3xl font-bold text-white">{t('carteira')}</h1>
            <p className="text-gray-400">Visão detalhada dos seus ativos e transações.</p>

            <div className="mt-8 p-6 bg-gray-800 rounded-2xl border border-gray-700">
                <p className="text-gray-400 text-sm">Valor Total da Carteira</p>
                <p className="text-4xl font-bold text-white mt-1">{numeral(totalWalletValue).format('$0,0.00')}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <h2 className="text-xl font-bold text-white mb-4">Distribuição de Ativos</h2>
                    <div className="bg-gray-800 p-4 rounded-lg h-80 mb-8">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => numeral(value).format('$0,0.00')} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full"><p className="text-gray-500">Sem ativos para exibir no gráfico.</p></div>
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-white mb-4">Meus Ativos</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg text-white">BRL (Real Brasileiro)</p>
                                <p className="text-sm text-gray-400">Saldo em conta</p>
                            </div>
                            <p className="font-semibold text-white">{numeral(data.saldo_brl).format('$0,0.00')}</p>
                        </div>
                        {data.ativos.map(ativo => <AssetItem key={ativo.moeda} ativo={ativo} />)}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-4">Últimas Transações</h2>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        {data.transacoes && data.transacoes.length > 0 ? (
                            <ul className="divide-y divide-gray-700">
                                {data.transacoes.map((tx, index) => (
                                    <TransactionItem key={index} tx={tx} currentUser={data.usuario} />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 py-4">Nenhuma transação recente.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
