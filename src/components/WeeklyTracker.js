import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import { LocalFireDepartment as FireIcon } from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';
import { 
  getStartOfWeekUTC, 
  getDayOfWeekUTC, 
  formatDateForUser, 
  addDaysUTC, 
  isWithinIntervalUTC 
} from '../utils/dateUtils';

const WeeklyTracker = () => {
  const theme = useTheme();
  const { tasks } = useTasks();
  const startOfWeek = getStartOfWeekUTC(new Date());
  const today = getDayOfWeekUTC(new Date());

  const isCompletedOnDay = (task, dayIndex) => {
    if (!task.completionHistory) return false;
    const dayStart = addDaysUTC(startOfWeek, dayIndex);
    const dayEnd = addDaysUTC(dayStart, 1);
    return task.completionHistory.some(date => 
      isWithinIntervalUTC(new Date(date), { start: dayStart, end: dayEnd })
    );
  };

  return (
    <Box className="weekly-tracker" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Weekly Progress</Typography>
      <Typography variant="subtitle2" gutterBottom>
        {formatDateForUser(startOfWeek, 'PP')} - {formatDateForUser(addDaysUTC(startOfWeek, 6), 'PP')}
      </Typography>
      {tasks.map((task, taskIndex) => (
        <Box key={taskIndex} mb={2}>
          <Typography variant="subtitle1">{task.text}</Typography>
          <Grid container spacing={1}>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const isCompleted = isCompletedOnDay(task, dayIndex);
              return (
                <Grid item key={dayIndex}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      border: `2px solid ${theme.palette.primary.main}`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: dayIndex > today ? 0.5 : 1,
                      color: theme.palette.text.primary,
                      bgcolor: isCompleted ? theme.palette.primary.main : theme.palette.background.default,
                    }}
                  >
                    {isCompleted ? (
                      <FireIcon sx={{ color: theme.palette.background.default }} fontSize="small" />
                    ) : (
                      ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayIndex]
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default WeeklyTracker;