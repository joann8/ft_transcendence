import React, { useState } from "react";
import "./App.css";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import SideBar from "./components/MainCompo/SideBars";
import Homepage from "./components/Homepage/Homepage";

function App(props: any) {
  const handleCanvas = (iconId: any) => {
    console.log("Profile click");
    setCanvas(iconId);
  };

  const test = () => {
    fetch("http://localhost:3001").then((res) => {
      console.log(res);
    });
  };
  test();

  const homePage = <Homepage handleCanvas={handleCanvas} />;
  const [canvas, setCanvas] = useState(homePage);

  const mdTheme = createTheme({
    palette: {
      primary: {
        main: "#000000",
      },
      secondary: {
        main: "#e1e1e1", //call obj from color
      },
    },
    /*
     you can import font from google font to change the police ==> index.css
     typography: {
       fontFamily:'Quicksand',
       fontWeightLight: 400,
       fontWeightRegular: 500,
       fontWeightMedium: 600,
       fontWeightBold: 700,
     }*/
  });
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideBar handleCanvas={handleCanvas} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
