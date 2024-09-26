import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import { LocalFireDepartment as FireIcon } from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';
import { 
  getStartOfWeekUTC, 
  getDayOfWeekUTC, 
  formatDateForUser, 
  addDaysUTC, 
  isWithinIntervalUTC,
  getCurrentUTCDate
} from '../utils/dateUtils';

const WeeklyTracker = ({ testDate }) => {
  const theme = useTheme();
  const { tasks } = useTasks();
  const currentDate = testDate ? new Date(testDate) : new Date(getCurrentUTCDate());
  const startOfWeek = new Date(getStartOfWeekUTC(currentDate, 0)); // 0 for Sunday start
  const today = getDayOfWeekUTC(currentDate);

  const isCompletedOnDay = (task, dayIndex) => {
    if (!task.completionHistory) return false;
    const dayDate = new Date(addDaysUTC(startOfWeek, dayIndex));
    return task.completionHistory.some(date => {
      const completionDate = new Date(date);
      return isWithinIntervalUTC(completionDate, {
        start: dayDate,
        end: new Date(addDaysUTC(dayDate, 1))
      });
    });
  };

  return (
    <Box className="weekly-tracker" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Weekly Progress</Typography>
      <Typography variant="subtitle2" gutterBottom>
        {formatDateForUser(startOfWeek, 'PP')} - {formatDateForUser(new Date(addDaysUTC(startOfWeek, 6)), 'PP')}
      </Typography>
      {tasks.map((task, taskIndex) => (
        <Box key={taskIndex} mb={2}>
          <Typography variant="subtitle1">{task.text}</Typography>
          <Grid container spacing={1}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, dayIndex) => {
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
                      opacity: dayIndex <= (today+1) ? 1 : 0.5,
                      color: theme.palette.text.primary,
                      bgcolor: isCompleted ? theme.palette.primary.main : theme.palette.background.default,
                    }}
                  >
                    {isCompleted ? (
                      <FireIcon sx={{ color: theme.palette.background.default }} fontSize="small" />
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

export default WeeklyTracker;