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

  // Persistence
  useEffect(() => {
    localStorage.setItem("daily_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("daily_notes", JSON.stringify(dailyNotes));
  }, [dailyNotes]);

  // Task Actions
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: crypto.randomUUID(),
      date: selectedDate,
      completed: false,
      createdAt: new Date().toISOString(),
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

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
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

      <ProgressSummary stats={stats} />

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTaskCompletion}
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
