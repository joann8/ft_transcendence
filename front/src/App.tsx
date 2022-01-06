import React from 'react';
import './App.css';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import SideBar from './components/MainCompo/SideBars';
import MyContent from './components/MyContent/MyContent';
 
function App() {

  const mdTheme = createTheme();
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
       
        <CssBaseline />
       
        <SideBar />

        <MyContent />    
      </Box>
        
    </ThemeProvider>
)
}

export default App;
