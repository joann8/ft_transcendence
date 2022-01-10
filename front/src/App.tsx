import React, { useState } from "react";
import "./App.css";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import SideBar from "./components/MainCompo/SideBars";
import MyContent from "./components/MyContent/MyContent";
import Homepage from "./components/Homepage/Homepage";
import NoPage from "./components/Errors/NoPage";
import { Route, Routes, Link, BrowserRouter as Router } from "react-router-dom";
import { Typography } from "@mui/material";
import Game from './components/Game'

function App(props: any) {

  const handleCanvas = (iconId: any) => {
    console.log("Profile click");
    setCanvas(iconId);
  };
  
  const homePage = <Homepage handleCanvas={handleCanvas} />;
  const [canvas, setCanvas] = useState(homePage);





  const mdTheme = createTheme();
  {/*const mdTheme = createTheme({
    palette: {
      primary: {
        main: '#fefefe'
      },
      secondary: purple //call obj from color
     }
     you can import font from google font to change the police ==> index.css
     typography: {
       fontFamily:'Quicksand',
       fontWeightLight: 400,
       fontWeightRegular: 500,
       fontWeightMedium: 600,
       fontWeightBold: 700,
     }
  });*/}
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideBar handleCanvas={handleCanvas} />
        {/*canvas*/}
        {/*<Homepage />*/}
      </Box>
    </ThemeProvider>
  );
}

export default App;
