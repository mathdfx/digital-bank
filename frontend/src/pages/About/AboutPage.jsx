import React from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Database, Palette, Globe, Zap, Shield, Users, Heart } from 'lucide-react';

const FeatureCard = ({ icon, title, description, color = "blue" }) => (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
        <div className={`w-16 h-16 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <div className="text-white">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

const TechBadge = ({ name, color = "gray" }) => (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800 border border-${color}-200`}>
        {name}
    </span>
);

const TeamMember = ({ name, role, avatar, description }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {avatar}
        </div>
        <h4 className="text-lg font-bold text-gray-800 mb-1">{name}</h4>
        <p className="text-blue-600 font-medium text-sm mb-3">{role}</p>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

export const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-600 rounded-3xl mb-6">
                        <span className="text-white text-3xl font-bold">B</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Sobre o <span className="gradient-text">BNJ Bank</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Uma plataforma completa de carteira digital desenvolvida com tecnologias modernas, 
                        oferecendo uma experiência bancária 100% digital e brasileira.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                        <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                        <div className="text-sm text-gray-600">Digital</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                        <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                        <div className="text-sm text-gray-600">Moedas</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                        <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                        <div className="text-sm text-gray-600">Disponível</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                        <div className="text-3xl font-bold text-orange-600 mb-2">🔒</div>
                        <div className="text-sm text-gray-600">Seguro</div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Recursos Principais</h2>
                        <p className="text-gray-600 text-lg">Desenvolvido com as melhores práticas e tecnologias</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap size={32} />}
                            title="Transações Instantâneas"
                            description="Realize transferências e negociações em tempo real com nossa API otimizada e sistema de notificações em tempo real."
                            color="yellow"
                        />
                        <FeatureCard
                            icon={<Shield size={32} />}
                            title="Segurança Avançada"
                            description="Autenticação JWT, hash de senhas e validação de dados garantem a máxima segurança das suas informações."
                            color="green"
                        />
                        <FeatureCard
                            icon={<Globe size={32} />}
                            title="Multi-idiomas"
                            description="Interface disponível em português e inglês, com suporte completo para localização brasileira."
                            color="blue"
                        />
                        <FeatureCard
                            icon={<Database size={32} />}
                            title="Dados em Tempo Real"
                            description="Cotações atualizadas automaticamente através de APIs externas confiáveis do mercado financeiro."
                            color="purple"
                        />
                        <FeatureCard
                            icon={<Palette size={32} />}
                            title="Design Moderno"
                            description="Interface intuitiva e responsiva, desenvolvida com Tailwind CSS e componentes otimizados para mobile."
                            color="pink"
                        />
                        <FeatureCard
                            icon={<Users size={32} />}
                            title="Experiência do Usuário"
                            description="Foco na usabilidade, com feedback visual, animações suaves e navegação intuitiva."
                            color="indigo"
                        />
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Stack Tecnológico</h2>
                        <p className="text-gray-600 text-lg">Tecnologias modernas para uma experiência superior</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Backend */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                                    <Database size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Backend (Python)</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                API RESTful construída com Flask seguindo padrões modernos de desenvolvimento,
                                com arquitetura modular e banco de dados SQLite.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <TechBadge name="Flask" color="green" />
                                <TechBadge name="SQLite" color="blue" />
                                <TechBadge name="JWT" color="purple" />
                                <TechBadge name="Marshmallow" color="orange" />
                                <TechBadge name="CORS" color="red" />
                            </div>
                        </div>

                        {/* Frontend */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                                    <Code size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Frontend (React)</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Interface moderna e responsiva desenvolvida com React, utilizando hooks,
                                gerenciamento de estado e componentes reutilizáveis.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <TechBadge name="React" color="blue" />
                                <TechBadge name="Tailwind CSS" color="teal" />
                                <TechBadge name="React Query" color="red" />
                                <TechBadge name="React Router" color="purple" />
                                <TechBadge name="Vite" color="yellow" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* APIs Externas */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">APIs Externas Integradas</h3>
                        <p className="text-gray-600">Dados precisos e em tempo real</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gray-50 rounded-2xl">
                            <div className="text-2xl mb-3">🚀</div>
                            <h4 className="font-bold text-gray-800 mb-2">AwesomeAPI</h4>
                            <p className="text-sm text-gray-600">Cotações em tempo real para transações</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-2xl">
                            <div className="text-2xl mb-3">📊</div>
                            <h4 className="font-bold text-gray-800 mb-2">CoinGecko</h4>
                            <p className="text-sm text-gray-600">Dados históricos de criptomoedas</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-2xl">
                            <div className="text-2xl mb-3">💱</div>
                            <h4 className="font-bold text-gray-800 mb-2">FxRatesAPI</h4>
                            <p className="text-sm text-gray-600">Histórico de moedas fiduciárias</p>
                        </div>
                    </div>
                </div>

                {/* Mission */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-12 text-center text-white mb-16">
                    <Heart size={48} className="mx-auto mb-6 opacity-80" />
                    <h3 className="text-3xl font-bold mb-4">Nossa Missão</h3>
                    <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-90">
                        Democratizar o acesso a serviços financeiros digitais no Brasil, oferecendo uma plataforma 
                        segura, intuitiva e totalmente brasileira para gerenciamento de carteiras digitais e 
                        investimentos em moedas internacionais.
                    </p>
                </div>

                {/* Contact */}
                <div className="text-center bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Quer saber mais?</h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Este é um projeto educacional que demonstra as melhores práticas de desenvolvimento 
                        full-stack com foco na experiência do usuário brasileiro.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="btn-primary">
                            Entre em Contato
                        </button>
                        <button className="btn-secondary">
                            Ver no GitHub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};