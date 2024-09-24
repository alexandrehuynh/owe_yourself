import { parseISO, format, isAfter, isSameDay, startOfDay, endOfDay, addDays, startOfWeek } from 'date-fns';
import { toDate, formatInTimeZone } from 'date-fns-tz';

export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const utcToUserTimezone = (utcDate) => {
  const userTimezone = getUserTimezone();
  return toDate(utcDate, { timeZone: userTimezone });
};

export const userTimezoneToUTC = (date) => {
  const userTimezone = getUserTimezone();
  return new Date(formatInTimeZone(date, userTimezone, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
};

export const getCurrentUTCDate = () => {
  return new Date().toUTCString();
};

export const formatDateForUser = (utcDate, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
  const userTimezone = getUserTimezone();
  return formatInTimeZone(new Date(utcDate), userTimezone, formatStr);
};

export const isUTCDateTodayInUserTimezone = (utcDate) => {
  const userNow = utcToUserTimezone(new Date());
  const userDate = utcToUserTimezone(new Date(utcDate));
  return isSameDay(userNow, userDate);
};

export const getUTCStartOfDayInUserTimezone = () => {
  const userTimezone = getUserTimezone();
  const now = new Date();
  const startOfDayUser = startOfDay(utcToUserTimezone(now));
  return formatInTimeZone(startOfDayUser, userTimezone, "yyyy-MM-dd'T'00:00:00.000'Z'");
};

export const isNewDayInUserTimezone = (lastCheckedUTC) => {
  const userNow = utcToUserTimezone(new Date());
  const lastCheckedUser = utcToUserTimezone(new Date(lastCheckedUTC));
  return !isSameDay(userNow, lastCheckedUser);
};

export const getNextMidnightUTC = () => {
  const userTimezone = getUserTimezone();
  const userNow = utcToUserTimezone(new Date());
  const userTomorrow = addDays(startOfDay(userNow), 1);
  return formatInTimeZone(userTomorrow, userTimezone, "yyyy-MM-dd'T'00:00:00.000'Z'");
};

export const getStartOfWeekUTC = (date, startDay = 0) => {
  const userTimezone = getUserTimezone();
  const userDate = utcToUserTimezone(date);
  const startOfWeekUser = startOfWeek(userDate, { weekStartsOn: startDay });
  return formatInTimeZone(startOfWeekUser, userTimezone, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

export const getDayOfWeekUTC = (date) => {
  const userDate = utcToUserTimezone(date);
  return userDate.getDay();
};

export const addDaysUTC = (date, days) => {
  const userTimezone = getUserTimezone();
  const userDate = utcToUserTimezone(date);
  const newUserDate = addDays(userDate, days);
  return formatInTimeZone(newUserDate, userTimezone, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

export const isWithinIntervalUTC = (date, interval) => {
  const userDate = utcToUserTimezone(date);
  const userStart = utcToUserTimezone(interval.start);
  const userEnd = utcToUserTimezone(interval.end);
  return userDate >= userStart && userDate < userEnd;
};