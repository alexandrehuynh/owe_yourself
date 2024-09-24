import { isUTCDateTodayInUserTimezone, getCurrentUTCDate } from './dateUtils';

export const updateStreak = (task) => {
  const today = getCurrentUTCDate();
  const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted) : null;
  
  if (lastCompleted && isUTCDateTodayInUserTimezone(lastCompleted)) {
    return task; // Already completed today
  }
  
  const isConsecutive = lastCompleted && 
    isUTCDateTodayInUserTimezone(new Date(lastCompleted.getTime() + 24 * 60 * 60 * 1000));
  
  return {
    ...task,
    done: true,
    streak: isConsecutive ? (task.streak || 0) + 1 : 1,
    lastCompleted: today
  };
};