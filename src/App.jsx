import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import DateNavigator from "./components/DateNavigator";
import ProgressSummary from "./components/ProgressSummary";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import DailyNotes from "./components/DailyNotes";

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("daily_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyNotes, setDailyNotes] = useState(() => {
    const saved = localStorage.getItem("daily_notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [activeTaskId, setActiveTaskId] = useState(() => {
    return localStorage.getItem('active_task_id') || null;
  });
  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    return localStorage.getItem('is_timer_running') === 'true';
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('daily_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('daily_notes', JSON.stringify(dailyNotes));
  }, [dailyNotes]);

  useEffect(() => {
    localStorage.setItem('active_task_id', activeTaskId || '');
    localStorage.setItem('is_timer_running', isTimerRunning);
  }, [activeTaskId, isTimerRunning]);

  // Timer Interval logic
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && activeTaskId) {
      interval = setInterval(() => {
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === activeTaskId 
              ? { ...t, elapsedSeconds: (t.elapsedSeconds || 0) + 1 } 
              : t
          )
        );
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeTaskId]);

  // Task Actions
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: crypto.randomUUID(),
      date: selectedDate,
      completed: false,
      createdAt: new Date().toISOString(),
      elapsedSeconds: 0
    };
    setTasks([...tasks, newTask]);
    setIsTaskFormOpen(false);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const startWork = (id) => {
    setActiveTaskId(id);
    setIsTimerRunning(true);
  };

  const pauseWork = () => {
    setIsTimerRunning(false);
  };

  const finishWork = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t));
    setIsTimerRunning(false);
    setActiveTaskId(null);
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
    if (id === activeTaskId) {
      setIsTimerRunning(false);
      setActiveTaskId(null);
    }
  };

  const saveDailyNotes = (notes) => {
    const existingIndex = dailyNotes.findIndex((n) => n.date === selectedDate);
    if (existingIndex > -1) {
      const updatedNotes = [...dailyNotes];
      updatedNotes[existingIndex].notes = notes;
      setDailyNotes(updatedNotes);
    } else {
      setDailyNotes([...dailyNotes, { date: selectedDate, notes }]);
    }
  };

  // Derived State
  const filteredTasks = tasks.filter((t) => t.date === selectedDate);
  const currentNotes =
    dailyNotes.find((n) => n.date === selectedDate)?.notes || "";

  const stats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter((t) => t.completed).length,
    remaining: filteredTasks.filter((t) => !t.completed).length,
    percentage:
      filteredTasks.length > 0
        ? Math.round(
            (filteredTasks.filter((t) => t.completed).length /
              filteredTasks.length) *
              100,
          )
        : 0,
    totalEstimatedMinutes: filteredTasks.reduce(
      (acc, t) => acc + (Number(t.estimatedMinutes) || 0),
      0,
    ),
    totalActualMinutes: Math.floor(filteredTasks.reduce(
      (acc, t) => acc + (t.elapsedSeconds || 0),
      0,
    ) / 60),
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":");
  };

  return (
    <div className="app-container">
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onAddTask={() => setIsTaskFormOpen(true)}
      />

      <DateNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {activeTask && (
        <div className="active-session-bar">
          <div>
            <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Working on:</p>
            <p style={{ fontWeight: '600' }}>{activeTask.title}</p>
          </div>
          <div className="timer-display">{formatTime(activeTask.elapsedSeconds || 0)}</div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isTimerRunning ? (
              <button className="btn-timer" onClick={pauseWork}>Pause</button>
            ) : (
              <button className="btn-timer" style={{ background: 'var(--primary-color)' }} onClick={() => setIsTimerRunning(true)}>Resume</button>
            )}
            <button className="btn-finish" onClick={() => finishWork(activeTaskId)}>Finish</button>
          </div>
        </div>
      )}

      <ProgressSummary stats={stats} />

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTaskCompletion}
        activeTaskId={activeTaskId}
        onStartWork={startWork}
        onEdit={(task) => {
          setEditingTask(task);
          setIsTaskFormOpen(true);
        }}
        onDelete={deleteTask}
      />

      <DailyNotes notes={currentNotes} onSave={saveDailyNotes} stats={stats} />

      {isTaskFormOpen && (
        <TaskForm
          onClose={() => {
            setIsTaskFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? updateTask : addTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default App;
