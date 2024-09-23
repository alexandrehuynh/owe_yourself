import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, Box } from '@mui/material';

const TaskInput = ({ setTasks }) => {
  const [newTask, setNewTask] = useState({ text: '', category: '', priority: 'medium' });

  const addTask = () => {
    if (newTask.text.trim()) {
      setTasks(prevTasks => [...prevTasks, { ...newTask, done: false, streak: 0, lastCompleted: null }]);
      setNewTask({ text: '', category: '', priority: 'medium' });
    }
  };

  return (
    <Box className="task-input">
      <TextField
        value={newTask.text}
        onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
        placeholder="Enter a task"
        variant="outlined"
      />
      <TextField
        value={newTask.category}
        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        placeholder="Category"
        variant="outlined"
      />
      <Select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
      >
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </Select>
      <Button variant="contained" onClick={addTask}>Add</Button>
    </Box>
  );
};

export default TaskInput;