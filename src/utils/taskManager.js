import { getCurrentDayPST, isSameDay, getStartOfWeekPST, isPastMidnightPST } from './dateUtils';
import { addDays, differenceInDays, startOfDay } from 'date-fns';

export const resetTasks = (tasks) => {
  const now = new Date();
  const currentDay = getCurrentDayPST();
  const startOfWeek = getStartOfWeekPST(now);

  return tasks.map(task => {
    const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted) : null;
    const isCompletedToday = lastCompleted && isSameDay(lastCompleted, now);
    const isCompletedThisWeek = lastCompleted && lastCompleted >= startOfWeek;
    const daysSinceLastCompletion = lastCompleted ? differenceInDays(startOfDay(now), startOfDay(lastCompleted)) : null;

    return {
      ...task,
      done: isCompletedToday,
      streak: (isCompletedThisWeek && daysSinceLastCompletion <= 1) ? task.streak : 0,
      lastCompleted: isCompletedToday ? task.lastCompleted : null,
      completionHistory: task.completionHistory || []
    };
  });
};

export const checkAndResetTasks = (tasks, currentDay, setTasks, setCurrentDay) => {
  const now = new Date();
  const newDay = getCurrentDayPST();
  if (isPastMidnightPST(now) && newDay !== currentDay) {
    setCurrentDay(newDay);
    setTasks(resetTasks(tasks));
  }
};

export const updateTaskStreak = (task, completed) => {
  const now = new Date();
  const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted) : null;
  const daysSinceLastCompletion = lastCompleted ? differenceInDays(startOfDay(now), startOfDay(lastCompleted)) : null;
  const completionHistory = task.completionHistory || [];

  if (completed) {
    const newCompletionHistory = [...completionHistory, now.toISOString()];
    const isConsecutive = daysSinceLastCompletion === 1 || daysSinceLastCompletion === 0;
    return {
      ...task,
      done: true,
      streak: isConsecutive ? task.streak + 1 : 1,
      lastCompleted: now.toISOString(),
      completionHistory: newCompletionHistory
    };
  } else {
    return {
      ...task,
      done: false,
      streak: 0,
      lastCompleted: null,
      completionHistory
    };
  }
};