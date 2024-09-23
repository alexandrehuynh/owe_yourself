export const updateStreak = (task) => {
    const today = new Date();
    const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted) : null;
    
    if (lastCompleted && today.toDateString() === lastCompleted.toDateString()) {
      return task; // Already completed today
    }
    
    const isConsecutive = lastCompleted && 
      (today - lastCompleted) / (1000 * 60 * 60 * 24) <= 1;
    
    return {
      ...task,
      done: true,
      streak: isConsecutive ? (task.streak || 0) + 1 : 1,
      lastCompleted: today.toISOString()
    };
  };