import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { AddTask as AddTaskIcon } from '@mui/icons-material';

const TaskInput = ({ addTask }) => {
  const [task, setTask] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && task.trim()) {
      addTask(task);
      setTask('');  // Clear the input after adding
    }
  };

  return (
    <div className="task-input">
      <TextField
        label="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyPress}
        fullWidth
        variant="outlined"
      />
      <IconButton color="primary" onClick={() => { if (task.trim()) { addTask(task); setTask(''); } }}>
        <AddTaskIcon />
      </IconButton>
    </div>
  );
};

export default TaskInput;
