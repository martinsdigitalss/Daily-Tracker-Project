import React from 'react';

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={() => onToggle(task.id)} 
        style={{ width: '1.2rem', height: '1.2rem', marginTop: '0.25rem' }}
      />
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h3 className="task-title" style={{ fontSize: '1rem', fontWeight: '500' }}>{task.title}</h3>
          <span className={`priority-badge priority-${task.priority}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {task.description}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Created: {formatTime(task.createdAt)}</span>
          {task.estimatedMinutes && (
            <span>Est: {task.estimatedMinutes}m</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          className="btn-outline" 
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button 
          className="btn-outline" 
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--high-priority)' }}
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
