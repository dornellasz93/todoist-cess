import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { TaskProvider } from './contexts/TaskContext.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-main)',
          gap: '16px'
        }}
      >
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
          Carregando ambiente seguro...
        </span>
      </div>
    );
  }

  return isAuthenticated ? (
    <TaskProvider>
      <DashboardPage />
    </TaskProvider>
  ) : (
    <AuthPage />
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
