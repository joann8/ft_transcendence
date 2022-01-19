import React, { createContext, Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Route, Routes, Link, BrowserRouter as Router, Navigate } from "react-router-dom";
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

//import {socketContext, socket} from "./contexts/SocketContext"

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



  //Deal with logout code
  useEffect(() => {

    if (!isLoggedIn && isMounted) {
      setCount(count + 1)
      console.log("Logout process")
    }
    setMounted(true)
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login count={count} login={isLoggedIn} setLogin={setLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    )
  }
  else {
    return (
      <Router>
        {/*<SideBars />*/}
        <Routes>
          <Route path="/" element={<SideBars login={isLoggedIn} setLogin={setLogin} />}>
            <Route index element={<Homepage />} />
            <Route path="login" element={<Login login={isLoggedIn}/>}/>
            <Route path="game">
              <Route index element={< GameMenu />} />
              <Route path="pong" element={<GamePage />} />
              <Route path="watch" element={<GamePage />} />
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
  {/*  <socketContext.Provider value={socket}>*/}
    <Root />
  {/*</socketContext.Provider>*/}
  </React.StrictMode>,
  document.getElementById("root")
);
