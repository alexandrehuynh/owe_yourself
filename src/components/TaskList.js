import React from 'react';
import { List, Typography } from '@mui/material';
import Task from './Task';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTasks } from '../contexts/TaskContext';

const TaskList = () => {
  const { tasks, setTasks } = useTasks();

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
        No tasks yet. Add a task to get started!
      </Typography>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <List {...provided.droppableProps} ref={provided.innerRef} sx={{ mt: 3 }}>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;