import React from 'react';
import { ListItem, ListItemText, IconButton, TextField } from '@mui/material';
import { Delete as DeleteIcon, CheckCircleOutline as DoneIcon, Save as SaveIcon } from '@mui/icons-material';

const Task = ({ task, index, markTaskDone, deleteTask, startEditingTask, saveEditedTask, editingIndex, editingTask, setEditingTask }) => {
  return (
    <ListItem style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {editingIndex === index ? (
        <>
          {/* Display input field for editing */}
          <TextField
            value={editingTask}
            onChange={(e) => setEditingTask(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveEditedTask(index); }}
            fullWidth
            autoFocus
          />
          <IconButton edge="end" aria-label="save" onClick={() => saveEditedTask(index)}>
            <SaveIcon color="primary" />
          </IconButton>
        </>
      ) : (
        <>
          <div style={{ flexGrow: 1 }}>
            <ListItemText
              primary={`${task.text} (Streak: ${task.streak !== null && task.streak !== undefined ? task.streak : 0})`}
              onClick={() => startEditingTask(index)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <IconButton edge="end" aria-label="done" onClick={() => markTaskDone(index)}>
            <DoneIcon color="primary" />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(index)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      )}
    </ListItem>
  );
};

export default Task;
