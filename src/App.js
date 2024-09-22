import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Checkbox, List, ListItem, ListItemText } from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon, AddTask as AddTaskIcon } from '@mui/icons-material';
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
        <IconButton color="primary" onClick={addTask}>
          <AddTaskIcon />
        </IconButton>
      </div>

      <List>
        {tasks.map((t, index) => (
          <ListItem key={index} className={editingIndex === index ? 'edit-mode' : ''} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="checkbox-container">
            <Checkbox
              checked={t.done}
              onChange={() => toggleTask(index)}
              style={{ paddingLeft: '0px' }}
            />
          </div>
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
              <div className="text-container">
                <ListItemText
                  primary={t.text}
                  style={{ textDecoration: t.done ? 'line-through' : 'none', cursor: 'pointer' }}
                  onClick={() => startEditingTask(index)}  
                />
              </div>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteTask(index)}
                style={{ marginLeft: 'auto' }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}
        </ListItem>        
        ))}
      </List>
    </div>
  );
};

export default App;
