import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTask, setEditingTask] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskText) => {
    setTasks([...tasks, { text: taskText, done: false, streak: 0, lastCompleted: null }]);
  };

  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  return (
    <div className="app">
      <h1>I Owe It To Myself</h1>
      <TaskInput addTask={addTask} />
      <TaskList
        tasks={tasks}
        setTasks={updateTasks}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />
    </div>
  );
};

export default App;
