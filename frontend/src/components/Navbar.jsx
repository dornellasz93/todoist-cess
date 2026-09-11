import React from 'react';
import { CheckSquare, LogOut, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-header)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.875rem 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <CheckSquare size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', lineHeight: 1.2, margin: 0 }}>TaskFlow</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Gestão Inteligente</span>
          </div>
        </div>

        {/* User Info & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-icon"
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label="Alternar Tema"
          >
            {theme === 'dark' ? <Sun size={18} color="var(--warning)" /> : <Moon size={18} color="var(--primary)" />}
          </button>

          {/* User Profile Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--bg-input)',
              padding: '4px 10px 4px 6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getInitials(user?.nome)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {user?.nome?.split(' ')[0] || 'Usuário'}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', lineHeight: 1 }}>
                {user?.email}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="btn btn-danger btn-icon"
            title="Sair da Conta"
            aria-label="Logout"
            style={{ padding: '0.6rem' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
