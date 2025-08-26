import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ArrowLeftRight, CandlestickChart, Settings, Wallet, Info, Languages, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const navItems = [
    { icon: <Home size={22} />, label: 'dashboard', path: '/', color: 'bg-blue-50 text-blue-600' },
    { icon: <Wallet size={22} />, label: 'carteira', path: '/carteira', color: 'bg-green-50 text-green-600' },
    { icon: <CandlestickChart size={22} />, label: 'trade', path: '/negociar', color: 'bg-orange-50 text-orange-600' },
    { icon: <Info size={22} />, label: 'about', path: '/sobre', color: 'bg-purple-50 text-purple-600' },
];

const NavItem = ({ item, isActive, t }) => (
    <Link to={item.path}>
        <div className={`
            relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group
            ${isActive 
                ? `${item.color} shadow-sm scale-105` 
                : 'text-gray-600 hover:bg-gray-50'
            }
        `}>
            {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
            )}
            <div className={`
                flex items-center justify-center w-10 h-10 rounded-xl transition-colors
                ${isActive ? 'bg-white shadow-sm' : 'group-hover:bg-gray-100'}
            `}>
                {item.icon}
            </div>
            <span className="font-medium text-sm">{t(item.label)}</span>
        </div>
    </Link>
);

export const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/auth/login');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="w-72 bg-white border-r border-gray-100 h-screen flex flex-col shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">BNJ Bank</h1>
                        <p className="text-xs text-gray-500">Seu banco digital</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-6">
                <nav className="space-y-2">
                    <div className="mb-6">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                            Menu Principal
                        </h2>
                        {navItems.map((item) => (
                            <NavItem 
                                key={item.label} 
                                item={item} 
                                isActive={location.pathname === item.path}
                                t={t}
                            />
                        ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                            Configurações
                        </h2>
                        
                        <div className="space-y-2">
                            <button 
                                onClick={() => changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')}
                                className="w-full flex items-center gap-4 p-3 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl group-hover:bg-gray-100">
                                    <Languages size={22} />
                                </div>
                                <span className="font-medium text-sm">
                                    {i18n.language === 'pt' ? 'English' : 'Português'}
                                </span>
                            </button>

                            <button className="w-full flex items-center gap-4 p-3 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl group-hover:bg-gray-100">
                                    <Settings size={22} />
                                </div>
                                <span className="font-medium text-sm">Configurações</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">Usuário</p>
                        <p className="text-xs text-gray-500">Conta Premium</p>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-600 hover:bg-red-50 transition-colors group"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl group-hover:bg-red-100 transition-colors">
                        <LogOut size={20} />
                    </div>
                    <span className="font-medium text-sm">Sair da conta</span>
                </button>
            </div>
        </div>
    );
};