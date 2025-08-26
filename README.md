BNJ Ilto - Carteira Digital Full-Stack

📖 Sobre o Projeto

O BNJ Ilto é uma aplicação web completa de uma carteira digital, desenvolvida com o objetivo de simular um ambiente bancário moderno. A plataforma permite que os utilizadores criem uma conta, façam login de forma segura, consultem os seus saldos, realizem transferências para outros utilizadores e negociem diferentes moedas digitais, tudo numa interface limpa, reativa e inspirada nos melhores designs de fintechs do mercado.

Este projeto foi construído como um portfólio para demonstrar competências em desenvolvimento full-stack, utilizando tecnologias modernas tanto no frontend (React) como no backend (Flask).

✨ Funcionalidades Implementadas ✨

Autenticação Segura: Sistema completo de registo e login com senhas criptografadas e tokens de acesso JWT.

Dashboard Dinâmico: Painel principal que exibe o saldo total do utilizador em tempo real, obtido através da API.

Transferências entre Utilizadores: Funcionalidade para enviar valores (BRL) para outros utilizadores registados na plataforma.

Negociação de Moedas: Página dedicada para a compra e venda de diferentes moedas (ex: BTC, USD, EUR), com cotações obtidas de uma API externa.

Interface Responsiva: Design "mobile-first" que se adapta perfeitamente a qualquer tamanho de ecrã, desde telemóveis a desktops.

Feedback ao Utilizador: Notificações (toasts) para todas as operações, informando sobre o sucesso ou erro de cada ação.

🛠️ Tecnologias Utilizadas 🛠️ 

Este projeto é dividido em duas partes principais: o frontend e o backend.

Frontend (React + Vite)
Framework: React

Build Tool: Vite

Estilização: Tailwind CSS

Roteamento: React Router DOM

Gestão de Formulários: React Hook Form

Chamadas à API: Axios & React Query

Ícones: Lucide React

Gráficos: Recharts

Notificações: React Hot Toast

Backend (Python + Flask)
Framework: Flask

Autenticação: Flask-JWT-Extended

Validação de Dados: Flask-Marshmallow

Base de Dados: SQLite

Comunicação com API Externa: Requests

API de Cotações: AwesomeAPI para obter os preços das moedas em tempo real.

Variáveis de Ambiente: python-dotenv

🚀 Como Executar o Projeto Localmente 🚀

Para executar o projeto, você precisará de ter o Node.js (v18+) e o Python (v3.10+) instalados na sua máquina.

1. Configuração do Backend

Navegue para a pasta do backend
cd backend

Crie e ative um ambiente virtual

python -m venv .venv

No Windows:
.venv\Scripts\activate

No macOS/Linux:
source .venv/bin/activate

Instale as dependências do Python

pip install -r requirements.txt

Crie um ficheiro .env na raiz da pasta 'backend' com o seguinte conteúdo:

FLASK_ENV=development
SECRET_KEY=sua-chave-secreta-aqui
JWT_SECRET_KEY=sua-outra-chave-secreta-aqui

Inicialize a base de dados (execute apenas uma vez)
flask init-db

Inicie o servidor do backend
flask run

O servidor da API estará a correr em http://127.0.0.1:5000.

2. Configuração do Frontend
   
Abra um novo terminal e navegue para a pasta do frontend
cd frontend

Instale as dependências do Node.js

npm install

Inicie o servidor de desenvolvimento do frontend
npm run dev

A aplicação estará acessível em http://localhost:5173 (ou noutra porta indicada pelo Vite).
