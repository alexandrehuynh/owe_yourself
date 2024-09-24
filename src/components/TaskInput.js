import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, Box } from '@mui/material';
import { useTasks } from '../contexts/TaskContext';

const TaskInput = () => {
  const { addTask } = useTasks();
  const [newTask, setNewTask] = useState({ text: '', category: '', priority: '' });

  const handleAddTask = () => {
    if (newTask.text.trim()) {
      addTask(newTask);
      setNewTask({ text: '', category: '', priority: '' });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
      <TextField
        value={newTask.text}
        onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
        onKeyPress={handleKeyPress}
        placeholder="Enter a task"
        variant="outlined"
        sx={{ flexGrow: 1, mr: 1 }}
      />
      <TextField
        value={newTask.category}
        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        onKeyPress={handleKeyPress}
        placeholder="Category (optional)"
        variant="outlined"
        sx={{ mr: 1 }}
      />
      <Select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <em>Priority (optional)</em>;
          }
          return selected;
        }}
        sx={{ mr: 1, minWidth: 120 }}
      >
        <MenuItem value="" disabled>
          <em>Priority (optional)</em>
        </MenuItem>
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </Select>
      <Button
        variant="contained"
        onClick={handleAddTask}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          px: 3,
          py: 1
        }}
      >
        ADD
      </Button>
    </Box>
  );
};

export default TaskInput;