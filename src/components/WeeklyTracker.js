import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import { LocalFireDepartment as FireIcon } from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';
import { getStartOfWeekPST, getDayOfWeekPST } from '../utils/dateUtils';
import { addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const WeeklyTracker = () => {
  const theme = useTheme();
  const { tasks } = useTasks();
  const [startDate, endDate] = getWeekDates();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = getDayOfWeekPST(new Date());
  const startOfWeek = getStartOfWeekPST(new Date());

  const isCompletedOnDay = (task, dayIndex) => {
    if (!task.completionHistory) return false;
    const dayStart = startOfDay(addDays(startOfWeek, dayIndex));
    const dayEnd = endOfDay(dayStart);
    return task.completionHistory.some(date => {
      const completedDate = new Date(date);
      return isWithinInterval(completedDate, { start: dayStart, end: dayEnd });
    });
  };

  return (
    <Box className="weekly-tracker" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Weekly Progress</Typography>
      <Typography variant="subtitle2" gutterBottom>{startDate} - {endDate}</Typography>
      {tasks.map((task, taskIndex) => (
        <Box key={taskIndex} mb={2}>
          <Typography variant="subtitle1">{task.text}</Typography>
          <Grid container spacing={1}>
            {days.map((day, dayIndex) => {
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
                      bgcolor: theme.palette.background.default,
                    }}
                  >
                    {isCompleted ? (
                      <FireIcon color="primary" fontSize="small" />
                    ) : (
                      day
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

const getWeekDates = () => {
  const now = new Date();
  const start = getStartOfWeekPST(now);
  const end = addDays(start, 6);
  return [start.toLocaleDateString(), end.toLocaleDateString()];
};

export default WeeklyTracker;