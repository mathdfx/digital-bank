import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Lock, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const loadingToast = toast.loading('A criar a sua conta...');

        try {
            await axios.post('http://127.0.0.1:5000/auth/register', {
                usuario: data.username,
                senha: data.password,
            });

            toast.success('Conta criada com sucesso! A redirecionar...', { id: loadingToast });
            
            setTimeout(() => navigate('/auth/login'), 2000);

        } catch (error) {
            const errorMessage = error.response?.data?.erro || 'Não foi possível criar a conta.';
            toast.error(errorMessage, { id: loadingToast });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Criar conta no BNJ Bank</h2>
                    <p className="mt-2 text-gray-500">Comece a sua jornada financeira connosco.</p>
                </div>
            
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Utilizador</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Escolha o seu utilizador"
                                {...register('username', {
                                    required: 'O nome de utilizador é obrigatório.',
                                    minLength: { value: 3, message: 'O utilizador deve ter pelo menos 3 caracteres.' }
                                })}
                                className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Senha</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="password"
                                placeholder="Crie uma senha segura"
                                {...register('password', {
                                    required: 'A senha é obrigatória.',
                                    minLength: { value: 6, message: 'A senha deve ter pelo menos 6 caracteres.' }
                                })}
                                className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all">
                            <LogIn size={20} />
                            Registar
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Já tem uma conta?{' '}
                    <Link to="/auth/login" className="font-medium text-green-600 hover:underline">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
};
