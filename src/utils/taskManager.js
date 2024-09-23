import { isYesterday, isSameDay, startOfWeek } from 'date-fns';
import { convertToUserTimezone, getCurrentDateInUserTimezone, formatInUserTimezone } from './timezoneUtils';

export const resetTasks = (tasks) => {
    const now = getCurrentDateInUserTimezone();
    const startOfWeekDate = startOfWeek(now, { weekStartsOn: 1 }); // Start week on Monday
  
    return tasks.map(task => {
      const lastCompleted = task.lastCompleted ? convertToUserTimezone(new Date(task.lastCompleted)) : null;
      const isCompletedToday = lastCompleted && isSameDay(lastCompleted, now);
      const isCompletedThisWeek = task.completionHistory.some(date => 
        isSameDay(convertToUserTimezone(new Date(date)), now) || 
        (convertToUserTimezone(new Date(date)) > startOfWeekDate && convertToUserTimezone(new Date(date)) <= now)
      );
  
      return {
        ...task,
        done: false, // Reset done status every day
        streak: isCompletedThisWeek ? (isCompletedToday ? task.streak : task.streak + 1) : 0,
        lastCompleted: null // Reset lastCompleted
      };
    });
  };

export const updateCompletionHistory = (task, completed) => {
  const today = formatInUserTimezone(getCurrentDateInUserTimezone(), 'yyyy-MM-dd');
  let updatedHistory = [...(task.completionHistory || [])];
  
  if (completed && !updatedHistory.includes(today)) {
    updatedHistory.push(today);
  } else if (!completed) {
    updatedHistory = updatedHistory.filter(date => date !== today);
  }

  return {
    ...task,
    completionHistory: updatedHistory,
    done: completed,
    lastCompleted: completed ? new Date().toISOString() : task.lastCompleted
  };
};

export const updateTaskStreak = (task, completed) => {
    const now = getCurrentDateInUserTimezone();
    const lastCompleted = task.lastCompleted ? convertToUserTimezone(new Date(task.lastCompleted)) : null;
  
    if (completed) {
      if (!lastCompleted || !isSameDay(now, lastCompleted)) {
        return { ...task, streak: task.streak + 1, lastCompleted: now.toISOString() };
      }
    } else if (!completed && lastCompleted && isSameDay(now, lastCompleted)) {
      return { ...task, streak: Math.max(0, task.streak - 1), lastCompleted: null };
    }
  
    return task;
  };

export const checkAndResetTasks = (tasks, currentDay, setTasks, setCurrentDay) => {
  const newDay = formatInUserTimezone(getCurrentDateInUserTimezone(), 'yyyy-MM-dd');
  if (newDay !== currentDay) {
    setCurrentDay(newDay);
    setTasks(resetTasks(tasks));
  }
};