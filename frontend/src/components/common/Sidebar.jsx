import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeftRight, CandlestickChart, Settings, Bot, Languages, Wallet, Info } from "lucide-react"; // Importa o ícone 'Info'
import { useTranslation } from "react-i18next";

const navItems = [
    { icon: <Home size={24} />, label: 'dashboard', path: '/' },
    { icon: <Wallet size={24} />, label: 'carteira', path: '/carteira' },
    { icon: <CandlestickChart size={24} />, label: 'trade', path: '/negociar' },
    { icon: <Info size={24} />, label: 'about', path: '/sobre' }, // Link atualizado
];

export const Sidebar = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <nav className="h-screen w-20 bg-gray-800 text-gray-400 flex flex-col p-4 items-center shadow-lg">
            <div className="mb-10">
                <Link to="/">
                    <Bot size={32} className="text-purple-400" />
                </Link>
            </div>
            <ul className="flex-1 flex flex-col items-center space-y-8">
                {navItems.map((item) => (
                    <li key={item.label} className="relative group">
                        <Link to={item.path} className={`hover:text-purple-400 transition-colors ${location.pathname === item.path ? 'text-purple-400' : ''}`}>
                            {location.pathname === item.path && (
                                <span className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-1 bg-purple-400 rounded-r-full"></span>
                            )}
                            {item.icon}
                        </Link>
                        <span className="absolute left-full ml-4 w-auto min-w-max p-2 text-xs text-white bg-gray-900 rounded-md shadow-md
                                       transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-in-out origin-left">
                            {t(item.label)}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="flex flex-col items-center space-y-4">
                <div className="group relative">
                     <button onClick={() => changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')} className="hover:text-purple-400 transition-colors">
                        <Languages size={24} />
                    </button>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-auto min-w-max p-2 text-xs text-white bg-gray-900 rounded-md shadow-md
                                   transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-in-out origin-bottom">
                       {i18n.language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
                    </span>
                </div>
                <a href="#" className="hover:text-purple-400 transition-colors">
                    <Settings size={24} />
                </a>
            </div>
        </nav>
    );
};