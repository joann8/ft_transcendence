import React, { createContext, Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Route, Routes, Link, BrowserRouter as Router } from "react-router-dom";
import MyContent from "./components/MyContent/MyContent";
import Homepage from "./components/Homepage/Homepage";
import NoPage from "./components/Errors/NoPage";

import GameMenu from "./components/Game/GameMenu";
import GamePage from "./components/Game/GamePage";

import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import Chat from "./components/Chat/Chat";
import Profile from "./components/Profile";
import SideBars from "./components/MainCompo/SideBars";
import { ThemeProvider } from "@mui/styles";
import { Box, createTheme, CssBaseline, Grid, Toolbar } from "@mui/material";
import GameIndex from "./components/GameModule";
import GameModule from "./components/GameModule";
import Login from "./components/Login";
import { setFlagsFromString } from "v8";



/* LOGOUT
let navigate = useNavigate();
useEffect(() => {
  setTimeout(() => {
    navigate("/logout");
  }, 30000);
}, []);
*/

function Root() {

  const [isLoggedIn, setLogin] = useState(false);
  const [test, setTest] = useState(true)
  const [count, setCount] = useState(0)
  const [isMounted, setMounted] = useState(false)


  //Deals with Tom's back end to check Authentication
  function handleLogin ()
  {
    //const authSuccess = checkWithBackend()
    const authSuccess = true
    console.log("authentication here")
    if (authSuccess)
      setLogin(true)
  }

  //Deal with logout code
  useEffect(() => {

    if (!isLoggedIn && isMounted)
    {
      setCount(count + 1)
      console.log("Logout process")
    }
    setMounted(true)
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <Fragment>
        <Toolbar />
        <Grid container alignItems="center" justifyContent="center">
          <Grid item>
            <h1> Login Page</h1>
            <button type="submit" onClick={() => handleLogin()}> Login </button>
            <p> {`Logout code was executed : ${count} times`} </p>
          </Grid>
        </Grid>
      </Fragment>)
  }
  else {
    return (
      <Router>
        {/*<SideBars />*/}
        <Routes>
          <Route path="/" element={<SideBars login={isLoggedIn} setLogin={setLogin} />}>
            <Route index element={<Homepage />} />
            <Route path="game">
              <Route index element={< GameMenu />} />
              <Route path="game" element={<GamePage />} />
            </Route>
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>

      </Router>
    );
  }
}
export default Root;

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
