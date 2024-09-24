import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, Chip, Tooltip, Typography, TextField, Select, MenuItem, Box } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Flag as FlagIcon, LocalFireDepartment as FireIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import CheckBoxAnim from './CheckBoxAnim';
import { formatDateForUser, isUTCDateTodayInUserTimezone } from '../utils/dateUtils';
import { useTasks } from '../contexts/TaskContext';

const Task = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [editedTaskText, setEditedTaskText] = useState(task.text);
  const [editedCategory, setEditedCategory] = useState(task.category || '');
  const [editedPriority, setEditedPriority] = useState(task.priority || '');

  const handleToggle = () => {
    updateTask(task.id, { done: !task.done });
  };

  const handleEdit = () => {
    updateTask(task.id, { text: editedTaskText, category: editedCategory, priority: editedPriority });
    setEditing(false);
  };

  const handleStartEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditedTaskText(task.text);
    setEditedCategory(task.category || '');
    setEditedPriority(task.priority || '');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEdit();
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

  const showLastCompleted = task.done || task.streak > 0;

  return (
    <ListItem sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      <CheckBoxAnim
        checked={task.done}
        onChange={handleToggle}
        streak={task.streak}
      />
      <ListItemText
        primary={
          editing ? (
            <Box display="flex" gap={1} alignItems="center">
              <TextField
                value={editedTaskText}
                onChange={(e) => setEditedTaskText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Task name"
                size="small"
                sx={{ flex: 2 }}
              />
              <TextField
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Category (optional)"
                size="small"
                sx={{ flex: 1 }}
              />
              <Select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                displayEmpty
              >
                <MenuItem value=""><em>Priority (optional)</em></MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </Box>
          ) : (
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              {task.text}
            </Typography>
          )
        }
        secondary={
          <>
            {task.category}
            {showLastCompleted && task.lastCompleted && (
              <span>
                {" - Last completed: "}
                {formatDateForUser(task.lastCompleted, 'PPP')}
                {isUTCDateTodayInUserTimezone(task.lastCompleted) && " (Today)"}
              </span>
            )}
          </>
        }
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
      {editing ? (
        <>
          <IconButton onClick={handleEdit}>
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleCancelEdit}>
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton onClick={handleStartEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteTask(task.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </ListItem>
  );
};

export default Task;