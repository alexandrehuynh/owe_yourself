import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Grid, Paper, Switch, FormControlLabel } from '@mui/material';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import WeeklyTracker from './components/WeeklyTracker';
import { TaskProvider } from './contexts/TaskContext';
import './App.css';

const App = () => {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaskProvider>
        <Container className="app-container">
          <Paper className="app-content">
            <h1>I Owe It To Myself</h1>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
              label="Dark Mode"
            />
            <TaskInput />
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TaskList />
              </Grid>
              <Grid item xs={12} md={4}>
                <WeeklyTracker />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;