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

function App(props: any) {
  const homePage = <Homepage />;
  const [canvas, setCanvas] = useState(homePage);

  const handleCanvas = (iconId: any) => {
    console.log("Profile click");
    setCanvas(iconId);
  };

  const mdTheme = createTheme();
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideBar handleCanvas={handleCanvas} />
        {canvas}
        {/*<Homepage />*/}
      </Box>
    </ThemeProvider>
  );
}

export default App;
