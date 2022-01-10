import React from "react";
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
import { Box, createTheme, CssBaseline } from "@mui/material";
import GameIndex from "./components/GameModule";
import GameModule from "./components/GameModule";



/* LOGOUT
let navigate = useNavigate();
useEffect(() => {
  setTimeout(() => {
    navigate("/logout");
  }, 30000);
}, []);
*/

function Root() {

  return (
    <Router>
      {/*<SideBars />*/}
      <Routes>
        <Route path="/" element={<SideBars />}>
          <Route index element={<Homepage />} />
          <Route path="game">
           <Route index element={< GameMenu/>} />
           <Route path="game" element={<GamePage/>} />
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
export default Root;

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
