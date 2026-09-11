import React from 'react';
import { ListTodo, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext.jsx';

export const StatsCard = () => {
  const { stats } = useTasks();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}
    >
      {/* Total */}
      <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ListTodo size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total de Tarefas</span>
          <h3 style={{ fontSize: '1.6rem', lineHeight: 1.1, marginTop: '2px' }}>{stats.total}</h3>
        </div>
      </div>

      {/* Pendentes */}
      <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--warning-bg)',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Clock size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Pendentes</span>
          <h3 style={{ fontSize: '1.6rem', lineHeight: 1.1, marginTop: '2px', color: 'var(--warning)' }}>
            {stats.pendentes}
          </h3>
        </div>
      </div>

      {/* Concluídas */}
      <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CheckCircle2 size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Concluídas</span>
          <h3 style={{ fontSize: '1.6rem', lineHeight: 1.1, marginTop: '2px', color: 'var(--success)' }}>
            {stats.concluidas}
          </h3>
        </div>
      </div>

      {/* Progresso Geral */}
      <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} color="var(--accent)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Conclusão</span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>
            {stats.taxaConclusao}%
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)'
          }}
        >
          <div
            style={{
              width: `${stats.taxaConclusao}%`,
              height: '100%',
              background: 'var(--accent-gradient)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.5s ease-in-out'
            }}
          />
        </div>
      </div>
    </div>
  );
};
