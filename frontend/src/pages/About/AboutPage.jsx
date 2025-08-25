import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Database, Code, Wind, Share2 } from 'lucide-react';

const TechCard = ({ icon, title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full">
        <div className="flex items-center gap-4 mb-3">
            {icon}
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{children}</p>
    </div>
);

export const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white">{t('about')}</h1>
            <p className="text-gray-400 mt-2">
                Uma visão geral da arquitetura, tecnologias e funcionalidades desta aplicação de carteira digital.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <TechCard icon={<Bot size={28} className="text-purple-400" />} title="Backend (Python + Flask)">
                    A API foi construída com Flask, um micro-framework Python, seguindo o padrão Application Factory. Utiliza SQLite para o banco de dados, Flask-JWT-Extended para autenticação segura com tokens e consome APIs externas para dados de mercado.
                </TechCard>

                <TechCard icon={<Code size={28} className="text-blue-400" />} title="Frontend (React + Vite)">
                    A interface foi desenvolvida com React e Vite, garantindo uma experiência de desenvolvimento rápida e uma aplicação reativa. Utilizamos React Query para gerenciamento de estado do servidor, React Router para navegação e i18next para suporte a múltiplos idiomas.
                </TechCard>

                <TechCard icon={<Wind size={28} className="text-teal-400" />} title="Estilização (Tailwind CSS)">
                    Todo o design da aplicação foi implementado com Tailwind CSS, permitindo a criação de uma interface moderna e totalmente responsiva (mobile-first) de forma utilitária e eficiente. Os gráficos são renderizados com a biblioteca Recharts.
                </TechCard>

                <TechCard icon={<Share2 size={28} className="text-yellow-400" />} title="APIs Externas">
                    Para as cotações em tempo real utilizadas nas transações, a aplicação consome a <strong>AwesomeAPI</strong>. Para os gráficos com dados históricos, são utilizadas as APIs da <strong>CoinGecko</strong> (para criptomoedas) e <strong>FxRatesAPI</strong> (para moedas fiduciárias).
                </TechCard>
            </div>
        </div>
    );
};
