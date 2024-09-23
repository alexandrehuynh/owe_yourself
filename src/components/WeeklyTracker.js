import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import { LocalFireDepartment as FireIcon } from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';

const WeeklyTracker = () => {
  const theme = useTheme();
  const { tasks } = useTasks();
  const [startDate, endDate] = getWeekDates();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();

  if (!tasks || tasks.length === 0) {
    return (
      <Box className="weekly-tracker" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Weekly Progress</Typography>
        <Typography variant="body2">No tasks to track yet.</Typography>
      </Box>
    );
  }

  return (
    <Box className="weekly-tracker" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Weekly Progress</Typography>
      <Typography variant="subtitle2" gutterBottom>{startDate} - {endDate}</Typography>
      {tasks.map((task, taskIndex) => (
        <Box key={taskIndex} mb={2}>
          <Typography variant="subtitle1">{task.text}</Typography>
          <Grid container spacing={1}>
            {days.map((day, dayIndex) => (
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
                  {dayIndex <= today && task.streak > dayIndex ? (
                    <FireIcon color="primary" fontSize="small" />
                  ) : (
                    day
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

const getWeekDates = () => {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - now.getDay()));
  const end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  return [start.toLocaleDateString(), end.toLocaleDateString()];
};

export default WeeklyTracker;