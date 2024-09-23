import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, Box } from '@mui/material';

const TaskInput = ({ setTasks }) => {
  const [newTask, setNewTask] = useState({ text: '', category: '', priority: '' });

  const addTask = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      if (newTask.text.trim()) {
        setTasks(prevTasks => [...prevTasks, { ...newTask, done: false, streak: 0, lastCompleted: null }]);
        setNewTask({ text: '', category: '', priority: '' });
      }
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
      <TextField
        value={newTask.text}
        onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
        onKeyPress={addTask}
        placeholder="Enter a task"
        variant="outlined"
        sx={{ flexGrow: 1, mr: 1 }}
      />
      <TextField
        value={newTask.category}
        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        placeholder="Category (optional)"
        variant="outlined"
        sx={{ mr: 1 }}
      />
      <Select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        displayEmpty
        sx={{ mr: 1 }}
      >
        <MenuItem value="">
          <em>Priority</em>
        </MenuItem>
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </Select>
      <Button variant="contained" onClick={addTask}>Add</Button>
    </Box>
  );
};

export default TaskInput;