import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, TextField, Chip, Menu, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, CheckCircle as DoneIcon, Edit as EditIcon, Flag as FlagIcon, Save as SaveIcon } from '@mui/icons-material';

const Task = ({ task, index, updateTask, deleteTask }) => {
  const [editing, setEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleEdit = () => setEditing(true);
  const handleSave = () => {
    updateTask(index, editedTask);
    setEditing(false);
  };
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handlePriorityChange = (priority) => {
    setEditedTask({ ...editedTask, priority });
    handleMenuClose();
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
    <ListItem className="task-item">
      {editing ? (
        <>
          <TextField
            value={editedTask.text}
            onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
            fullWidth
            variant="standard"
          />
          <TextField
            value={editedTask.category}
            onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
            placeholder="Category"
            variant="standard"
          />
          <IconButton onClick={handleMenuOpen}>
            <FlagIcon color={getPriorityColor(editedTask.priority)} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handlePriorityChange('high')}>High</MenuItem>
            <MenuItem onClick={() => handlePriorityChange('medium')}>Medium</MenuItem>
            <MenuItem onClick={() => handlePriorityChange('low')}>Low</MenuItem>
          </Menu>
          <IconButton onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton onClick={() => updateTask(index, { ...task, done: !task.done })} color={task.done ? "primary" : "default"}>
            <DoneIcon />
          </IconButton>
          <ListItemText
            primary={task.text}
            secondary={`Streak: ${task.streak}`}
          />
          {task.category && <Chip label={task.category} size="small" />}
          <FlagIcon color={getPriorityColor(task.priority)} />
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