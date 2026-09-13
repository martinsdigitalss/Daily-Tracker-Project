import React from 'react';

const ProgressSummary = ({ stats }) => {
  return (
    <section className="card">
      <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Today's Progress</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>{stats.completed} / {stats.total} completed</span>
        <span style={{ fontWeight: '600' }}>{stats.percentage}%</span>
      </div>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${stats.percentage}%` }}></div>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <span>Remaining: {stats.remaining}</span>
      </div>
    </section>
  );
};

export default ProgressSummary;
