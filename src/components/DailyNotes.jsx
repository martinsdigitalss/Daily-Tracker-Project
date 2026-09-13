import React, { useState, useEffect } from 'react';

const DailyNotes = ({ notes, onSave, stats }) => {
  const [localNotes, setLocalNotes] = useState(notes);

  // Update local state when prop changes (different date selected)
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleSave = () => {
    onSave(localNotes);
  };

  return (
    <section className="card">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.completed} tasks</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Unfinished</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.remaining} tasks</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Est. Work Time</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.totalEstimatedMinutes} mins</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>End-of-day notes</h3>
      <textarea 
        className="btn-outline"
        style={{ width: '100%', minHeight: '120px', padding: '1rem', cursor: 'text', marginBottom: '1rem', resize: 'vertical' }}
        value={localNotes}
        onChange={(e) => setLocalNotes(e.target.value)}
        placeholder="What went well today? What should I continue tomorrow?"
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleSave}>Save Daily Summary</button>
      </div>
    </section>
  );
};

export default DailyNotes;
