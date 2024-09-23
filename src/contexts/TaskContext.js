import React, { createContext, useState, useEffect, useContext } from 'react';
import { resetTasks } from '../utils/taskManager';
import { addDays, startOfDay, differenceInMilliseconds } from 'date-fns';
import { getCurrentDateInUserTimezone } from '../utils/timezoneUtils';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [currentDay, setCurrentDay] = useState(getCurrentDateInUserTimezone().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const scheduleNextMidnightReset = () => {
      const now = getCurrentDateInUserTimezone();
      const tomorrow = addDays(startOfDay(now), 1);
      const timeUntilMidnight = differenceInMilliseconds(tomorrow, now);
  
      setTimeout(() => {
        setTasks(prevTasks => resetTasks(prevTasks));
        scheduleNextMidnightReset();
      }, timeUntilMidnight);
    };
  
    scheduleNextMidnightReset();
  
    return () => clearTimeout(scheduleNextMidnightReset);
  }, []);

  const contextValue = {
    tasks,
    setTasks,
    currentDay
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};