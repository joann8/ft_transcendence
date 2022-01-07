import React from 'react';
import './App.css';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import SideBar from './components/MainCompo/SideBars';
import MyContent from './components/MyContent/MyContent';
import Homepage from './components/Homepage/Homepage';
import NoPage from './components/Errors/NoPage';
import {Route, Routes, Link, BrowserRouter as Router} from 'react-router-dom';
import { Typography } from '@mui/material';

function App() {

  const mdTheme = createTheme();
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
       
        <CssBaseline />
        <SideBar />
        <Router>
          <Routes>
            <Route path="/">
              <Route index element={<Homepage />} />
              <Route path="mycontent" element={<MyContent/>} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </Router>
        {/*<SideBar />*/}
        
        {/*<Homepage />*/}

        {/*<MyContent /> */}   
      </Box>
        
    </ThemeProvider>
)
}

export default App;
