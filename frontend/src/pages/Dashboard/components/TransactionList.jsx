import React from 'react';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getCompanyLogo = (name) => {
    const logos = {
        'The North Face': '🏔️',
        'McDonalds': '🍔',
        'Figma Pro': '🎨',
        'Starbucks': '☕',
        'Amazon': '📦'
    };
    return logos[name] || '💳';
};

const TransactionItem = ({ name, date, amount, icon }) => {
    return (
        <li className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                    {getCompanyLogo(name)}
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">
                        {format(new Date(date), "dd MMM yyyy", { locale: ptBR })}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-gray-900">
                    ${numeral(amount).format('0,0.00')}
                </p>
            </div>
        </li>
    );
};

export const TransactionList = ({ transactions }) => {
    const { t } = useTranslation();
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{t('transactions')}</h2>
                <p className="mt-4 text-center text-gray-500">Nenhuma transação encontrada.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('transactions')}</h2>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                    This Week <ChevronDown size={16} />
                </button>
            </div>
            
            <ul className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                    <TransactionItem 
                        key={transaction.id}
                        name={transaction.name}
                        date={transaction.date}
                        amount={transaction.amount}
                        icon={transaction.icon}
                    />
                ))}
            </ul>
        </div>
    );
};