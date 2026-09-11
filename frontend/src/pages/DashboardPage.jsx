import React from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { StatsCard } from '../components/StatsCard.jsx';
import { TaskForm } from '../components/TaskForm.jsx';
import { TaskFilter } from '../components/TaskFilter.jsx';
import { TaskList } from '../components/TaskList.jsx';
import { Toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {/* Welcome Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>
              Olá, <span style={{ color: 'var(--primary)' }}>{user?.nome || 'Usuário'}</span> 👋
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Aqui está o panorama das suas atividades de hoje.
            </p>
          </div>

          {/* Productivity Stats */}
          <StatsCard />

          {/* New Task Creation Form */}
          <TaskForm />

          {/* Task Filters & Search */}
          <TaskFilter />

          {/* Task List */}
          <TaskList />
        </div>
      </main>

      <Toast />
    </div>
  );
};
