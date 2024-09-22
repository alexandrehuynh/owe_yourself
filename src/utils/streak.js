export const updateStreak = (task) => {
    const today = new Date().toISOString().split('T')[0];
  
    // Initialize streak to 0 if it's undefined or null
    let streak = task.streak || 0;
  
    if (task.lastCompleted === today) {
      alert("You've already completed this task today!");
      return task;
    }
  
    // Increment streak if completed today
    streak = task.lastCompleted === today ? streak : streak + 1;
    return { ...task, streak: streak, lastCompleted: today };
  };
  