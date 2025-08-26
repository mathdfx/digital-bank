import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from '../components/common/Sidebar';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { AboutPage } from '../pages/About/AboutPage';
import { TradePage } from '../pages/Trade/TradePage';
import { WalletDetailsPage } from '../pages/Wallet/WalletDetailsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, 
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return children;
};

const MainLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '16px',
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Rotas Protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/carteira" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <WalletDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sobre" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AboutPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/negociar" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <TradePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Redirecionamento para a página principal */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;