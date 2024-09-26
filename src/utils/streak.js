import { 
  isUTCDateTodayInUserTimezone, 
  getCurrentUTCDate, 
  utcToUserTimezone,
  addDaysUTC
} from './dateUtils';

export const updateStreak = (task) => {
  const today = getCurrentUTCDate();
  const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted) : null;
  
  if (lastCompleted && isUTCDateTodayInUserTimezone(lastCompleted)) {
    return task; // Already completed today
  }
  
  const yesterdayUTC = addDaysUTC(today, -1);
  const isConsecutive = lastCompleted && 
    isUTCDateTodayInUserTimezone(yesterdayUTC);
  
  return {
    ...task,
    done: true,
    streak: isConsecutive ? (task.streak || 0) + 1 : 1,
    lastCompleted: today
  };
};