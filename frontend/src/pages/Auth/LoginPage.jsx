import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Lock, KeyRound, Bot } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onSubmit = async (data) => {
        const loadingToast = toast.loading('Verificando credenciais...');
        try {
            const response = await axios.post('http://127.0.0.1:5000/auth/login', {
                usuario: data.username,
                senha: data.password,
            });
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            toast.success('Login efetuado com sucesso!', { id: loadingToast });
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.mensagem || 'Não foi possível fazer o login.';
            toast.error(errorMessage, { id: loadingToast });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
                <div className="text-center">
                    <Bot size={48} className="mx-auto text-purple-400 mb-4" />
                    <h2 className="text-3xl font-bold">Entrar na sua Carteira</h2>
                    <p className="mt-2 text-gray-400">Acesse seu mundo financeiro.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Usuário</label>
                        <div className="relative mt-2">
                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Seu nome de usuário"
                                {...register('username', { required: "O nome de usuário é obrigatório." })}
                                className="w-full bg-gray-700 py-3 pl-10 pr-3 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Senha</label>
                        <div className="relative mt-2">
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                placeholder="Sua senha"
                                {...register('password', { required: "A senha é obrigatória." })}
                                className="w-full bg-gray-700 py-3 pl-10 pr-3 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div>
                        <button
                            type='submit'
                            className="w-full flex justify-center items-center gap-2 px-4 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                        >
                            <KeyRound size={20} />
                            Entrar
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Não tem uma conta?{' '}
                    <Link to="/auth/register" className="font-medium text-purple-400 hover:underline">
                        Registre-se
                    </Link>
                </p>
            </div>
        </div>
    );
};