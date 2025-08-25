import React from 'react';
import { Wifi, Plus } from 'lucide-react';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import { RecentContacts } from './RecentContacts';
import { TransferPanel } from './TransferPanel';

const CreditCard = ({ balance }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-gradient-to-br from-lime-300 to-green-500 text-black p-6 rounded-2xl shadow-lg flex flex-col justify-between h-52">
            <div className="flex justify-between items-start">
                <span className="font-bold text-xl italic">VISA</span>
                <Wifi size={24} />
            </div>
            <div>
                <p className="text-3xl font-bold tracking-wider">{numeral(balance).format('$0,0.00')}</p>
                <div className="flex justify-between items-end mt-2">
                    <p className="font-mono text-lg tracking-widest">**** 1287 2342</p>
                    <p className="text-xs opacity-70">Exp 05/29</p>
                </div>
            </div>
        </div>
    );
};

export const SidePanel = ({ userBalance }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col gap-8">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{t('my_cards')}</h2>
                    <button className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-colors">
                        <Plus size={20} />
                    </button>
                </div>
                <CreditCard balance={userBalance} />
            </div>
            <RecentContacts />
            <TransferPanel />
        </div>
    );
};