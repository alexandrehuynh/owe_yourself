import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Grid, Paper, Switch, FormControlLabel, TextField, Button, Box } from '@mui/material';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import WeeklyTracker from './components/WeeklyTracker';
import { TaskProvider } from './contexts/TaskContext';
import { getUserTimezone, userTimezoneToUTC, addDaysUTC } from './utils/dateUtils';
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [testDate, setTestDate] = useState(null);
  const [testDateInput, setTestDateInput] = useState('');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#f7f9fc',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#333333',
      },
    },
  });

  const handleSetTestDate = () => {
    if (testDateInput) {
      const userTimezone = getUserTimezone();
      const [year, month, day] = testDateInput.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const utcDate = userTimezoneToUTC(localDate);
      const adjustedDate = new Date(addDaysUTC(utcDate, 1)); // Add one day
      setTestDate(adjustedDate);
    } else {
      setTestDate(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaskProvider>
        <Container className="app-container">
          <Paper className="app-content">
            <h1>I Owe It To Myself</h1>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                label="Dark Mode"
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  label="Test Date"
                  type="date"
                  value={testDateInput}
                  onChange={(e) => setTestDateInput(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
                <Button variant="contained" onClick={handleSetTestDate} size="small">
                  {testDate ? 'Update' : 'Set'} Test Date
                </Button>
                {testDate && (
                  <Button variant="outlined" onClick={() => { setTestDate(null); setTestDateInput(''); }} size="small">
                    Clear Test Date
                  </Button>
                )}
              </Box>
            </Box>
            <TaskInput />
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TaskList />
              </Grid>
              <Grid item xs={12} md={4}>
                <WeeklyTracker testDate={testDate} />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;