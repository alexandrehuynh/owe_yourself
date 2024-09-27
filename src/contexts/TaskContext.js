import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCurrentUTCDate, 
  isNewDayInUserTimezone, 
  getNextMidnightUTC,
  getUTCStartOfDayInUserTimezone,
  formatDateForUser,
  isUTCDateTodayInUserTimezone,
  addDaysUTC
} from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';
import { calculateStreak, updateCompletionHistory } from '../utils/streakUtils';


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
      const now = getCurrentUTCDate();
      const nextMidnight = getNextMidnightUTC();
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
    const startOfDay = new Date(getUTCStartOfDayInUserTimezone());
    return tasksToReset.map(task => ({
      ...task,
      done: false,
      lastCompleted: task.lastCompleted && new Date(task.lastCompleted) >= startOfDay 
        ? task.lastCompleted 
        : null,
      streak: task.lastCompleted && new Date(task.lastCompleted) >= startOfDay
        ? task.streak
        : 0
    }));
  };

  const updateCompletionHistory = (history, date, completed) => {
    const dateString = date.toISOString().split('T')[0];
    if (completed && !history.includes(dateString)) {
      return [...history, dateString];
    } else if (!completed) {
      return history.filter(d => d !== dateString);
    }
    return history;
  };
  
  const updateTaskStreak = (task, completed) => {
    const today = getCurrentUTCDate();
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = new Date(addDaysUTC(today, -1)).toISOString().split('T')[0];
  
    const newCompletionHistory = updateCompletionHistory(task.completionHistory || [], today, completed);
  
    let newStreak = task.streak;
    if (completed) {
      if (newCompletionHistory.includes(yesterdayString)) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      if (newStreak > 0 && !newCompletionHistory.includes(yesterdayString)) {
        newStreak -= 1;
      }
    }
  
    return {
      ...task,
      done: completed,
      streak: newStreak,
      lastCompleted: completed ? today : task.lastCompleted,
      completionHistory: newCompletionHistory
    };
  };

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (updates.done !== undefined) {
            return updateTaskStreak(task, updates.done);
          }
          return { ...task, ...updates };
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