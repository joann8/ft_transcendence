import React, { createContext, Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Route, Routes, Link, BrowserRouter as Router, Navigate, useNavigate } from "react-router-dom";
import MyContent from "./components/MyContent/MyContent";
import Homepage from "./components/Homepage/Homepage";
import NoPage from "./components/Errors/NoPage";

import GameMenu from "./components/Game/GameMenu";
import GamePage from "./components/Game/GamePage";

import Leaderboard from "./components/Leaderboard";
import Chat from "./components/Chat/Chat";
import Profile from "./components/Profile/Profile";
import SideBars from "./components/MainCompo/SideBars";
import { ThemeProvider } from "@mui/styles";
import { Box, createTheme, CssBaseline, Grid, Toolbar } from "@mui/material";

import Login from "./components/Login";
import { setFlagsFromString } from "v8";
import PrivateRoute from "./components/PrivateRoute";
import TwoFactor from "./components/Two_Factor";



/* LOGOUT
let navigate = useNavigate();
useEffect(() => {
  setTimeout(() => {
    navigate("/logout");
  }, 30000);
}, []);
*/

function Root() {

  const [isAuth, setAuth] = useState((document.cookie !== '') ? true : false);
  const [count, setCount] = useState(0)
  const [isMounted, setMounted] = useState(false)




  /*
  let isAuth = false

  const setAuth = (bool : boolean) => {
    isAuth = bool
  }
  */

  //Deal with starting Component. Executed once only
  useEffect(() => {
    const tmp = document.cookie

    setMounted(true)
    console.log("useEffect onMount isAuth = ", isAuth)
  }, [])

  useEffect(() => {

    console.log("useEffect Root is rendered")
  })

  //Deal with logout code
  /*
  useEffect(() => {

    if (!isAuth && isMounted) {
      setCount(count + 1)
      console.log("Logout process")
    }
  }, [isAuth])
  */

  /*
    if (!isAuth) {
      return (
        <Router>
          <Routes>
            <Route path="/login" element={<Login count={count} login={isAuth} setLogin={setLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      )
    }
    else {
      */
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SideBars />}>
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
      <Route path="*" element={<NoPage />} />
    </Routes>
   </Router >
  )
}


/*
<Router>
    <Routes>
      <Route path="/login" element={ isAuth ?  <Navigate to="/"/> : <Login login={isAuth} setLogin={setAuth} /> }/>
      <Route path="/" element={
        <PrivateRoute login={isAuth}> <SideBars login={isAuth} setLogin={setAuth} /> </PrivateRoute>}>
        <Route index element={
          <PrivateRoute login={isAuth}> <Homepage /> </PrivateRoute>} />
      <Route path="twofactor" element={
          <PrivateRoute login={isAuth}> <TwoFactor/> </PrivateRoute>} />  
        <Route path="game">
          <Route index element={
            <PrivateRoute login={isAuth}> < GameMenu /></PrivateRoute>} />
          <Route path="game" element={
            <PrivateRoute login={isAuth}> <GamePage /> </PrivateRoute>} />
        </Route>

        <Route path="chat" element={
          <PrivateRoute login={isAuth}> <Chat /> </PrivateRoute>} />
        <Route path="profile" element={
          <PrivateRoute login={isAuth}> <Profile /> </PrivateRoute>} />
        <Route path="leaderboard" element={
          <PrivateRoute login={isAuth}> <Leaderboard /> </PrivateRoute>} />
          </Route>
      {/*<Route path="*" element={<NoPage />} />}
    </Routes>
  </Router>
);
}
return (
<Router>
<Routes>
 <Route path="/login" element={<Login login={isAuth} setLogin={setAuth} />} />
 <Route path="/" element={
   <PrivateRoute login={isAuth}>
     <SideBars login={isAuth} setLogin={setAuth} />
   </PrivateRoute>}>
     <PrivateRoute></PrivateRoute>
   <Route index element={<Homepage />} />
   <Route path="game">
     <Route index element={< GameMenu />} />
     <Route path="game" element={<GamePage />} />
   </Route>
   <Route path="chat" element={<Chat />} />
   <Route path="profile" element={<Profile />} />
   <Route path="leaderboard" element={<Leaderboard />} />
  { <Route path="*" element={<NoPage />} />}
 </Route>
 <Route path="*" element={<NoPage />} />
</Routes>
</Router>
);
}
*/

export default Root;

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
