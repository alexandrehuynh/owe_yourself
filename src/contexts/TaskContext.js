import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAndResetTasks } from '../utils/taskManager';
import * as dateUtils from '../utils/dateUtils';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [currentDay, setCurrentDay] = useState(dateUtils.getCurrentDayPST());

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const checkReset = () => checkAndResetTasks(tasks, currentDay, setTasks, setCurrentDay);
    checkReset();
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, [tasks, currentDay]);

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