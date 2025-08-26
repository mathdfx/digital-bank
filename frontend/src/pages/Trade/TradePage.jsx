import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingCart, Tag, TrendingUp, TrendingDown, DollarSign, Calculator, Zap, ArrowRightLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import { CurrencyPriceChart } from './components/CurrencyPriceChart';

const currencyConfig = {
    BTC: { name: 'Bitcoin', color: 'from-orange-400 to-orange-600', icon: '₿' },
    USD: { name: 'Dólar Americano', color: 'from-green-400 to-green-600', icon: '$' },
    EUR: { name: 'Euro', color: 'from-blue-400 to-blue-600', icon: '€' },
    GBP: { name: 'Libra Esterlina', color: 'from-purple-400 to-purple-600', icon: '£' },
    CNY: { name: 'Yuan Chinês', color: 'from-red-400 to-red-600', icon: '¥' },
};

const fetchTradeData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Utilizador não autenticado.');

    const [quotesRes, balancesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/carteira/cotacoes', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/carteira/saldos', { headers: { Authorization: `Bearer ${token}` } })
    ]);

    return { quotes: quotesRes.data, balances: balancesRes.data };
};

const CurrencySelector = ({ currencies, selectedCurrency, onSelect, quotes }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.keys(currencies).map(currency => {
            const config = currencies[currency];
            const isSelected = selectedCurrency === currency;
            const price = quotes[currency] || 0;
            
            return (
                <button
                    key={currency}
                    onClick={() => onSelect(currency)}
                    className={`
                        p-4 rounded-2xl border-2 transition-all duration-200 text-left
                        ${isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }
                    `}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                            {config.icon}
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">{currency}</div>
                            <div className="text-xs text-gray-500">{config.name}</div>
                        </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                        {numeral(price).format('R$ 0,0.00')}
                    </div>
                </button>
            );
        })}
    </div>
);

const ActionButton = ({ isActive, onClick, icon, label, color = "blue" }) => (
    <button
        onClick={onClick}
        className={`
            flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${isActive 
                ? `bg-${color}-600 text-white shadow-lg scale-105` 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
        `}
    >
        {icon}
        {label}
    </button>
);

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
        
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`http://127.0.0.1:5000${endpoint}`,
                { moeda: selectedCurrency, valor: parseFloat(formData.amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('🎉 Operação realizada com sucesso!');
            reset({ amount: '' });
            refetch();
        } catch (error) {
            const errorMessage = error.response?.data?.erro || 'Não foi possível realizar a operação.';
            toast.error(errorMessage);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando dados de mercado...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center bg-white rounded-2xl p-8 shadow-sm border">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-red-600 font-semibold mb-2">Erro ao carregar dados</p>
                <p className="text-gray-500 text-sm">Tente novamente em alguns instantes</p>
            </div>
        </div>
    );

    const selectedConfig = currencyConfig[selectedCurrency];
    const currentPrice = data.quotes[selectedCurrency];
    const result = conversionResult();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <ArrowRightLeft className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Central de Negociação</h1>
                            <p className="text-gray-600">Compre e venda moedas digitais com segurança</p>
                        </div>
                    </div>
                </div>

                {/* Currency Selection */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Selecione uma Moeda</h2>
                    <CurrencySelector 
                        currencies={currencyConfig}
                        selectedCurrency={selectedCurrency}
                        onSelect={setSelectedCurrency}
                        quotes={data.quotes}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chart Section */}
                    <div className="space-y-6">
                        <CurrencyPriceChart currency={selectedCurrency} />
                        
                        {/* Market Info */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Informações de Mercado</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                                    <div className="text-2xl mb-1">📈</div>
                                    <div className="text-sm text-gray-500">Preço Atual</div>
                                    <div className="font-bold text-gray-800">{numeral(currentPrice).format('R$ 0,0.00')}</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                                    <div className="text-2xl mb-1">⚡</div>
                                    <div className="text-sm text-gray-500">Variação 24h</div>
                                    <div className="font-bold text-green-600">+2.45%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trading Panel */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        {/* Action Toggle */}
                        <div className="flex gap-2 p-2 bg-gray-100 rounded-2xl mb-8">
                            <ActionButton
                                isActive={isBuying}
                                onClick={() => setIsBuying(true)}
                                icon={<ShoppingCart size={20} />}
                                label="Comprar"
                                color="green"
                            />
                            <ActionButton
                                isActive={!isBuying}
                                onClick={() => setIsBuying(false)}
                                icon={<Tag size={20} />}
                                label="Vender"
                                color="red"
                            />
                        </div>

                        {/* Selected Currency Display */}
                        <div className={`bg-gradient-to-r ${selectedConfig.color} rounded-2xl p-6 text-white mb-8`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{selectedConfig.icon}</div>
                                    <div>
                                        <div className="text-2xl font-bold">{selectedCurrency}</div>
                                        <div className="opacity-80">{selectedConfig.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm opacity-80">Preço atual</div>
                                    <div className="text-xl font-bold">{numeral(currentPrice).format('R$ 0,0.00')}</div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    {isBuying ? 'Valor em Reais (R$)' : `Quantidade em ${selectedCurrency}`}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        {isBuying ? (
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Calculator className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder={isBuying ? "0,00" : "0.00000000"}
                                        {...register('amount', {
                                            required: 'O valor é obrigatório.',
                                            valueAsNumber: true,
                                            min: { value: 0.00001, message: 'O valor é muito baixo.' }
                                        })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-semibold"
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                        <span>⚠</span> {errors.amount.message}
                                    </p>
                                )}
                            </div>

                            {/* Transaction Summary */}
                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Calculator size={16} />
                                    Resumo da Operação
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Seu saldo em BRL</span>
                                        <span className="font-semibold">{numeral(data.balances.saldo_brl).format('R$ 0,0.00')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Preço do {selectedCurrency}</span>
                                        <span className="font-semibold">{numeral(currentPrice).format('R$ 0,0.00')}</span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-gray-800">Você receberá</span>
                                        <span className="text-blue-600">
                                            {result.toFixed(8)} {isBuying ? selectedCurrency : 'BRL'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`
                                    w-full py-4 px-6 rounded-2xl font-bold text-lg text-white transition-all flex items-center justify-center gap-3 group
                                    ${isBuying 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25' 
                                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25'
                                    }
                                `}
                            >
                                {isBuying ? (
                                    <>
                                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                                        Comprar {selectedCurrency}
                                    </>
                                ) : (
                                    <>
                                        <Tag size={20} className="group-hover:scale-110 transition-transform" />
                                        Vender {selectedCurrency}
                                    </>
                                )}
                                <Zap size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </form>

                        {/* Disclaimer */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                            <p className="text-xs text-yellow-800">
                                <strong>⚠️ Atenção:</strong> As operações de compra e venda são executadas instantaneamente com base na cotação atual do mercado. Os preços podem variar devido à volatilidade.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};