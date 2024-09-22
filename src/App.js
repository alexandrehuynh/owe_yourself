import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Checkbox, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import './App.css';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTask, setEditingTask] = useState('');

  // Save tasks to local storage whenever the task list changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, done: false }]);
      setTask('');
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, done: !t.done } : t
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const startEditingTask = (index) => {
    setEditingIndex(index);
    setEditingTask(tasks[index].text);
  };

  const saveEditedTask = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, text: editingTask } : t
    );
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditingTask('');
  };

  return (
    <div className="app">
      <h1>Accountability To-Do List</h1>
      <div className="task-input">
        <TextField
          label="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={addTask}>
          Add Task
        </Button>
      </div>

      <List>
        {tasks.map((t, index) => (
          <ListItem key={index} className={editingIndex === index ? 'edit-mode' : ''}>
            <Checkbox
              checked={t.done}
              onChange={() => toggleTask(index)}
            />
            {editingIndex === index ? (
              <>
                <TextField
                  value={editingTask}
                  onChange={(e) => setEditingTask(e.target.value)}
                  fullWidth
                />
                <IconButton color="primary" onClick={() => saveEditedTask(index)}>
                  <SaveIcon />
                </IconButton>
              </>
            ) : (
              <>
                <ListItemText
                  primary={t.text}
                  onClick={() => startEditingTask(index)}
                  style={{ textDecoration: t.done ? 'line-through' : 'none', cursor: 'pointer' }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default App;
