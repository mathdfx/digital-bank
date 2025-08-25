import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from '../components/common/Sidebar';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { AboutPage } from '../pages/About/AboutPage'; // Importa a nova página
import { TradePage } from '../pages/Trade/TradePage';
import { WalletDetailsPage } from '../pages/Wallet/WalletDetailsPage';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return children;
};

const MainLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-900 text-white">
    <Sidebar />
    <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Rotas Protegidas */}
        <Route path="/" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
        <Route path="/carteira" element={<ProtectedRoute><MainLayout><WalletDetailsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/sobre" element={<ProtectedRoute><MainLayout><AboutPage /></MainLayout></ProtectedRoute>} /> {/* Nova rota */}
        <Route path="/negociar" element={<ProtectedRoute><MainLayout><TradePage /></MainLayout></ProtectedRoute>} />
        
        {/* Redirecionamento para a página principal */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;