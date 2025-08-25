import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, DollarSign, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TransferPanel = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        const loadingToast = toast.loading('A processar a transferência...');
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://127.0.0.1:5000/conta/transferencia',
                { destinatario: data.recipient, valor: parseFloat(data.amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Transferência realizada com sucesso!', { id: loadingToast });
            reset();
        } catch (error) {
            const errorMessage = error.response?.data?.erro || 'Não foi possível realizar a transferência.';
            toast.error(errorMessage, { id: loadingToast });
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-4">{t('quick_transfer')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="text-xs font-medium text-gray-400">{t('recipient')}</label>
                    <div className="relative mt-1">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="username"
                            {...register('recipient', { required: 'O destinatário é obrigatório.' })}
                            className="w-full bg-gray-700 text-white py-2 pl-9 pr-3 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-400">{t('amount')}</label>
                    <div className="relative mt-1">
                        <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('amount', { required: 'O valor é obrigatório.', valueAsNumber: true, min: { value: 0.01, message: 'O valor mínimo é 0.01.' } })}
                            className="w-full bg-gray-700 text-white py-2 pl-9 pr-3 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 px-4 py-2 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all"
                >
                    <Send size={16} />
                    {t('transfer_now')}
                </button>
            </form>
        </div>
    );
};