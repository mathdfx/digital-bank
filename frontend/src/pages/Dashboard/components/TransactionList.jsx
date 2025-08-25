import React from 'react';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';

const getInitials = (name) => {
    const words = name.split(' ');
    if (words.length > 1) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const TransactionItem = ({ name, date, amount }) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <li className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${randomColor}`}>
                    {getInitials(name)}
                </div>
                <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="text-sm text-gray-400">
                        {format(new Date(date), "dd MMM yyyy", { locale: ptBR })}
                    </p>
                </div>
            </div>
            <p className="font-semibold text-white">
                {numeral(amount).format('$0,0.00')}
            </p>
        </li>
    );
};

export const TransactionList = ({ transactions }) => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
        return (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-md mt-8">
                <h2 className="text-xl font-bold text-white">Transactions</h2>
                <p className="mt-4 text-center text-gray-400">Nenhuma transação encontrada.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Transactions</h2>
                <button className="flex items-center gap-1 text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-md">
                    This Week <ChevronDown size={16} />
                </button>
            </div>
            
            <ul className="divide-y divide-gray-700">
                {transactions.map((transaction) => (
                    <TransactionItem 
                        key={transaction.id}
                        name={transaction.name}
                        date={transaction.date}
                        amount={transaction.amount}
                    />
                ))}
            </ul>
        </div>
    );
};