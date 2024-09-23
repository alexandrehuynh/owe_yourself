import { getCurrentDayPST, isPastMidnightPST, getStartOfDayPST } from './dateUtils';

export const resetTasks = (tasks) => {
  const now = new Date();
  return tasks.map(task => ({
    ...task,
    done: false,
    lastCompleted: task.done ? getStartOfDayPST(now).toISOString() : task.lastCompleted
  }));
};

export const checkAndResetTasks = (tasks, currentDay, setTasks, setCurrentDay) => {
  const now = new Date();
  const newDay = getCurrentDayPST();
  if (isPastMidnightPST(now) && newDay !== currentDay) {
    setCurrentDay(newDay);
    setTasks(resetTasks(tasks));
  }
};

// Add other task-related functions here