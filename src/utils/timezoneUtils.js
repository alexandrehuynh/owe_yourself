import { startOfDay, endOfDay, format } from 'date-fns';
import { toDate, formatInTimeZone } from 'date-fns-tz';

export const getUserTimezone = () => {
  return localStorage.getItem('userTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const setUserTimezone = (timezone) => {
  localStorage.setItem('userTimezone', timezone);
};

export const convertToUserTimezone = (date) => {
  const userTimezone = getUserTimezone();
  return toDate(date, userTimezone);
};

export const getCurrentDateInUserTimezone = () => {
  const userTimezone = getUserTimezone();
  return toDate(new Date(), userTimezone);
};

export const formatInUserTimezone = (date, formatStr) => {
  const userTimezone = getUserTimezone();
  const zonedDate = toDate(date, userTimezone);
  return format(zonedDate, formatStr);
};

export const startOfDayInUserTimezone = (date) => {
  const userTimezone = getUserTimezone();
  const zonedDate = toDate(date, userTimezone);
  return formatInTimeZone(startOfDay(zonedDate), userTimezone);
};

export const endOfDayInUserTimezone = (date) => {
  const userTimezone = getUserTimezone();
  const zonedDate = toDate(date, userTimezone);
  return formatInTimeZone(endOfDay(zonedDate), userTimezone);
};