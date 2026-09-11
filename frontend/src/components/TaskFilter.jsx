import React from 'react';
import { Search, X, CheckCircle2, Clock, Layers } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext.jsx';

export const TaskFilter = () => {
  const { filter, setFilter, searchQuery, setSearchQuery, stats } = useTasks();

  const filterOptions = [
    { id: 'todas', label: 'Todas', count: stats.total, icon: <Layers size={15} /> },
    { id: 'pendente', label: 'Pendentes', count: stats.pendentes, icon: <Clock size={15} /> },
    { id: 'concluida', label: 'Concluídas', count: stats.concluidas, icon: <CheckCircle2 size={15} /> }
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}
    >
      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-card)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          gap: '4px'
        }}
      >
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className="btn"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                boxShadow: isActive ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                gap: '6px'
              }}
              id={`filter-tab-${opt.id}`}
            >
              {opt.icon}
              <span>{opt.label}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-input)',
                  color: isActive ? '#ffffff' : 'var(--text-subtle)',
                  fontWeight: 700
                }}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
        <div className="input-icon">
          <Search size={16} />
        </div>
        <input
          type="text"
          className="form-input has-icon"
          placeholder="Buscar tarefas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingRight: searchQuery ? '2rem' : '0.875rem' }}
          id="task-search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="btn-ghost btn-icon"
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '4px',
              cursor: 'pointer'
            }}
            title="Limpar busca"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
