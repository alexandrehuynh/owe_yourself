import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCurrentUTCDate, 
  isNewDayInUserTimezone, 
  getNextMidnightUTC,
  getUTCStartOfDayInUserTimezone,
  formatDateForUser,
  isUTCDateTodayInUserTimezone
} from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [lastResetCheck, setLastResetCheck] = useState(getCurrentUTCDate());

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const checkAndResetTasks = () => {
      if (isNewDayInUserTimezone(lastResetCheck)) {
        setTasks(prevTasks => resetTasks(prevTasks));
        setLastResetCheck(getCurrentUTCDate());
      }
    };

    const scheduleNextCheck = () => {
      const now = new Date();
      const nextMidnight = new Date(getNextMidnightUTC());
      const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

      setTimeout(() => {
        checkAndResetTasks();
        scheduleNextCheck();
      }, timeUntilMidnight);
    };

    checkAndResetTasks();
    scheduleNextCheck();

    return () => {
      // Clear any ongoing timeouts if the component unmounts
    };
  }, [lastResetCheck]);

  const resetTasks = (tasksToReset) => {
    const startOfDay = getUTCStartOfDayInUserTimezone();
    return tasksToReset.map(task => ({
      ...task,
      done: false,
      lastCompleted: task.lastCompleted && new Date(task.lastCompleted) >= new Date(startOfDay) 
        ? task.lastCompleted 
        : null,
      streak: task.lastCompleted && new Date(task.lastCompleted) >= new Date(startOfDay)
        ? task.streak
        : 0
    }));
  };

  const updateCompletionHistory = (task, completed) => {
    const today = formatDateForUser(getCurrentUTCDate(), 'yyyy-MM-dd');
    let updatedHistory = [...(task.completionHistory || [])];
    
    if (completed && !updatedHistory.includes(today)) {
      updatedHistory.push(today);
    } else if (!completed) {
      updatedHistory = updatedHistory.filter(date => date !== today);
    }
    
    return updatedHistory;
  };

  const updateTaskStreak = (task, completed) => {
    if (completed) {
      if (!task.lastCompleted || !isUTCDateTodayInUserTimezone(task.lastCompleted)) {
        return task.streak + 1; // Increment streak if the task wasn't already completed today
      }
    } else if (task.lastCompleted && isUTCDateTodayInUserTimezone(task.lastCompleted)) {
      return Math.max(0, task.streak - 1); // Decrease streak if the task is marked as not done
    }
    return task.streak; // Return current streak if no changes
  };
  

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, ...updates };
          if (updates.done !== undefined) {
            updatedTask.lastCompleted = updates.done ? getCurrentUTCDate() : null;
            updatedTask.completionHistory = updateCompletionHistory(updatedTask, updates.done);
            updatedTask.streak = updateTaskStreak(updatedTask, updates.done);
          }
          return updatedTask;
        }
        return task;
      })
    );
  };  

  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, { 
      ...newTask, 
      id: uuidv4(),
      done: false, 
      streak: 0, 
      lastCompleted: null,
      completionHistory: []
    }]);
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const contextValue = {
    tasks,
    setTasks,
    updateTask,
    addTask,
    deleteTask
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