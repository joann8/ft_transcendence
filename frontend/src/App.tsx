import React from 'react';
import Channel from './components/Channel';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
function App() {
  return (
    <ThemeProvider theme={theme}><Channel></Channel></ThemeProvider>
      
  );
}

export default App;