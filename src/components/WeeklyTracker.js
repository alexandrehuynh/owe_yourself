import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { LocalFireDepartment as FireIcon } from '@mui/icons-material';

const WeeklyTracker = ({ tasks }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();

  return (
    <Box className="weekly-tracker">
      <Typography variant="h6" gutterBottom>Weekly Progress</Typography>
      {tasks.map((task, index) => (
        <Box key={index} className="task-progress">
          <Typography variant="subtitle1">{task.text}</Typography>
          <Grid container spacing={1}>
            {days.map((day, dayIndex) => (
              <Grid item key={dayIndex}>
                <Box className={`day-circle ${dayIndex > today ? 'future' : ''}`}>
                  {dayIndex <= today && task.streak > dayIndex ? (
                    <FireIcon color="primary" fontSize="small" />
                  ) : (
                    day[0]
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

export default WeeklyTracker;