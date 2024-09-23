import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, Chip, Tooltip, TextField, Select, MenuItem, Typography } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Flag as FlagIcon, LocalFireDepartment as FireIcon, Save as SaveIcon } from '@mui/icons-material';
import CheckBoxAnim from '../utils/CheckBoxAnim';

const Task = ({ task, index, updateTask, deleteTask }) => {
  const [editing, setEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => setEditing(true);
  
  const handleSave = () => {
    updateTask(index, editedTask);
    setEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <ListItem sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      {editing ? (
        <>
          <TextField
            value={editedTask.text}
            onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
            onKeyDown={handleKeyDown}
            fullWidth
            variant="standard"
            autoFocus
          />
          <TextField
            value={editedTask.category}
            onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
            placeholder="Category"
            variant="standard"
          />
          <Select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">
              <em>Priority</em>
            </MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
          <IconButton onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        </>
      ) : (
        <>
          <CheckBoxAnim
            checked={task.streak > 0}
            onChange={() => updateTask(index, { done: !task.done })}
            streak={task.streak}
          />
          <ListItemText
            primary={
              <Typography variant="body1" style={{ fontWeight: 500 }}>
                {task.text}
              </Typography>
            }
            secondary={task.category}
          />
          {task.priority && (
            <Tooltip title={`Priority: ${task.priority}`}>
              <FlagIcon color={getPriorityColor(task.priority)} />
            </Tooltip>
          )}
          <Tooltip title={`Streak: ${task.streak}`}>
            <Chip
              icon={<FireIcon />}
              label={task.streak}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          </Tooltip>
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteTask(index)}>
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </ListItem>
  );
};

export default Task;