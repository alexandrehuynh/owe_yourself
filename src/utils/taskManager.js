import { getCurrentDayPST, isSameDay, getStartOfWeekPST } from './dateUtils';
import { addDays } from 'date-fns';

export const resetTasks = (tasks) => {
  const now = new Date();
  const startOfWeek = getStartOfWeekPST(now);

  return tasks.map(task => {
    const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted) : null;
    const isCompletedToday = lastCompleted && isSameDay(lastCompleted, now);
    const isCompletedThisWeek = lastCompleted && lastCompleted >= startOfWeek;

    return {
      ...task,
      done: isCompletedToday,
      streak: isCompletedThisWeek ? task.streak : 0,
      lastCompleted: isCompletedToday ? task.lastCompleted : null
    };
  });
};

export const checkAndResetTasks = (tasks, currentDay, setTasks, setCurrentDay) => {
  const newDay = getCurrentDayPST();
  if (newDay !== currentDay) {
    setCurrentDay(newDay);
    setTasks(resetTasks(tasks));
  }
};

export const updateTaskStreak = (task, completed) => {
  const now = new Date();
  const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted) : null;
  const isConsecutive = lastCompleted && isSameDay(addDays(lastCompleted, 1), now);

  if (completed) {
    return {
      ...task,
      done: true,
      streak: isConsecutive ? task.streak + 1 : 1,
      lastCompleted: now.toISOString()
    };
  } else {
    return {
      ...task,
      done: false,
      streak: Math.max(0, task.streak - 1),
      lastCompleted: null
    };
  }
};