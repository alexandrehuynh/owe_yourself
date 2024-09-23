import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Grid, Paper, Switch, FormControlLabel } from '@mui/material';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import WeeklyTracker from './components/WeeklyTracker';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [darkMode, setDarkMode] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container className="app-container">
        <Paper className="app-content">
          <h1>I Owe It To Myself</h1>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label="Dark Mode"
          />
          <TaskInput setTasks={setTasks} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TaskList tasks={tasks} setTasks={setTasks} />
            </Grid>
            <Grid item xs={12} md={4}>
              <WeeklyTracker tasks={tasks} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;