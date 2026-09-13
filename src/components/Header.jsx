import React from 'react';

const Header = ({ selectedDate, setSelectedDate, onAddTask }) => {
  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <header className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Daily Work Tracker</h1>
        <p style={{ color: 'var(--text-muted)' }}>{formatDate(selectedDate)}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
        />
        <button className="btn-primary" onClick={onAddTask}>+ Add Task</button>
      </div>
    </header>
  );
};

export default Header;
