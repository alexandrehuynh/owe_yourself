import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Checkbox, ListItemText } from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon, AddTask as AddTaskIcon } from '@mui/icons-material';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

  // Handle "Enter" key press in the input field for adding a task
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  // Handle "Enter" key press in the input field for saving an edited task
  const handleEditKeyPress = (event, index) => {
    if (event.key === 'Enter') {
      saveEditedTask(index);
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

  // Handle drag and drop reordering
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  return (
    <div className="app">
      <h1>Accountability To-Do List</h1>
      <div className="task-input">
        <TextField
          label="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyPress} 
          fullWidth
          variant="outlined"
          style={{ marginRight: '10px' }}
        />
        <IconButton color="primary" onClick={addTask}>
          <AddTaskIcon />
        </IconButton>
      </div>

      {/* Wrapping the list with DragDropContext and Droppable */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="task-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((t, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={editingIndex === index ? 'edit-mode' : ''}
                    style={{
                      ...provided.draggableProps.style,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                    }}
                  >
                    <div className="task-content">
                      <div className="checkbox-container">
                        <Checkbox
                          checked={t.done}
                          onChange={() => toggleTask(index)}
                        />
                      </div>
                      {editingIndex === index ? (
                        <>
                          <TextField
                            value={editingTask}
                            onChange={(e) => setEditingTask(e.target.value)}
                            onKeyDown={(e) => handleEditKeyPress(e, index)}
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
                    </div>
                  </li>
                )}
              </Draggable>              
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
