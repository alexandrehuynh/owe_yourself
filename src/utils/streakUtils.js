import { addDaysUTC, isUTCDateTodayInUserTimezone } from './dateUtils';

export const calculateStreak = (currentStreak, lastCompletedDate, newCompletionDate) => {
  if (!lastCompletedDate) return 1;
  const yesterday = addDaysUTC(newCompletionDate, -1);
  const isConsecutive = isUTCDateTodayInUserTimezone(lastCompletedDate, yesterday);
  return isConsecutive ? currentStreak + 1 : 1;
};

export const updateCompletionHistory = (history, date, completed) => {
  const updatedHistory = [...history];
  const dateString = date.toISOString();
  if (completed && !updatedHistory.includes(dateString)) {
    updatedHistory.push(dateString);
  } else if (!completed) {
    return updatedHistory.filter(d => d !== dateString);
  }
  return updatedHistory;
};