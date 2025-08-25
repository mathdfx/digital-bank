import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingCart, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import { CurrencyPriceChart } from './components/CurrencyPriceChart';

const fetchTradeData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Utilizador não autenticado.');

    const [quotesRes, balancesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/carteira/cotacoes', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/carteira/saldos', { headers: { Authorization: `Bearer ${token}` } })
    ]);

    return { quotes: quotesRes.data, balances: balancesRes.data };
};

export const TradePage = () => {
    const { t } = useTranslation();
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['tradeData'],
        queryFn: fetchTradeData,
        refetchInterval: 30000,
    });

    const [isBuying, setIsBuying] = useState(true);
    const [selectedCurrency, setSelectedCurrency] = useState('BTC'); 

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const amountValue = watch('amount', 0);

    const conversionResult = () => {
        if (!data || !amountValue || !selectedCurrency) return 0;
        const price = data.quotes[selectedCurrency];
        return isBuying ? amountValue / price : amountValue * price;
    };

    const onSubmit = async (formData) => {
        const endpoint = isBuying ? '/carteira/comprar' : '/carteira/vender';
        const loadingToast = toast.loading(`${isBuying ? 'Processando compra' : 'Processando venda'}...`);

        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`http://127.0.0.1:5000${endpoint}`,
                { moeda: selectedCurrency, valor: parseFloat(formData.amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Operação realizada com sucesso!', { id: loadingToast });
            reset({ amount: '' });
            refetch();
        } catch (error) {
            const errorMessage = error.response?.data?.erro || 'Não foi possível realizar a operação.';
            toast.error(errorMessage, { id: loadingToast });
        }
    };

    if (isLoading) return <div>Carregando dados...</div>;
    if (isError) return <div>Erro ao carregar dados.</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white">{t('trade_coins')}</h1>
            <p className="text-gray-400">{t('trade_intro')}</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <CurrencyPriceChart currency={selectedCurrency} />
                </div>

                <div className="bg-gray-800 p-8 rounded-2xl shadow-md">
                    <div className="flex border border-gray-700 rounded-lg p-1 mb-6">
                        <button onClick={() => setIsBuying(true)} className={`flex-1 py-2 rounded-md transition-colors ${isBuying ? 'bg-purple-600 text-white' : 'hover:bg-gray-700'}`}>{t('buy')}</button>
                        <button onClick={() => setIsBuying(false)} className={`flex-1 py-2 rounded-md transition-colors ${!isBuying ? 'bg-purple-600 text-white' : 'hover:bg-gray-700'}`}>{t('sell')}</button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-300">{t('currency')}</label>
                            <select
                                value={selectedCurrency}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                className="w-full mt-2 py-3 px-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            >
                                {Object.keys(data.quotes).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-300">{isBuying ? t('amount_to_spend_brl') : `${t('amount_to_sell')} (${selectedCurrency})`}</label>
                            <input
                                type="number" step="any" placeholder="0.00"
                                {...register('amount', { required: 'O valor é obrigatório.', valueAsNumber: true, min: { value: 0.00001, message: 'O valor é muito baixo.' } })}
                                className="w-full mt-2 py-3 px-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            />
                            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
                        </div>

                        <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{t('your_brl_balance')}</span><span className="font-mono">{numeral(data.balances.saldo_brl).format('$0,0.00')}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{t('price_of')} {selectedCurrency}</span><span className="font-mono">{selectedCurrency ? numeral(data.quotes[selectedCurrency]).format('$0,0.00') : 'N/A'}</span></div>
                            <hr className="border-gray-700" />
                            <div className="flex justify-between text-lg font-bold"><span className="text-gray-200">{t('you_will_receive_approx')}</span><span className="text-purple-400">{conversionResult().toFixed(8)} {isBuying ? selectedCurrency : 'BRL'}</span></div>
                        </div>

                        <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all">
                            {isBuying ? <ShoppingCart size={20} /> : <Tag size={20} />}
                            {isBuying ? `${t('buy')} ${selectedCurrency}` : `${t('sell')} ${selectedCurrency}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};