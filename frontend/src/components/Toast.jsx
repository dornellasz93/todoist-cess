import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext.jsx';

export const Toast = () => {
  const { toast, clearToast } = useTasks();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="var(--success)" />,
    error: <AlertCircle size={20} color="var(--danger)" />,
    info: <Info size={20} color="var(--primary)" />
  };

  const borders = {
    success: 'var(--success-border)',
    error: 'var(--danger-border)',
    info: 'rgba(99, 102, 241, 0.4)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'var(--bg-card)',
        border: `1px solid ${borders[toast.type] || 'var(--border-color)'}`,
        padding: '12px 18px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--text-main)',
        fontSize: '0.9rem',
        fontWeight: 500,
        animation: 'fadeIn 0.25s ease-out',
        maxWidth: '90vw'
      }}
    >
      {icons[toast.type] || icons.info}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={clearToast}
        className="btn-ghost btn-icon"
        style={{ padding: '2px', cursor: 'pointer' }}
        title="Fechar"
      >
        <X size={16} />
      </button>
    </div>
  );
};
