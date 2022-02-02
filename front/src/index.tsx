import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import NoPage from "./components/Errors/NoPage";
import GameMenu from "./components/Game/GameMenu";
import GamePage from "./components/Game/GamePage";
import Leaderboard from "./components/Leaderboard";
import Chat from "./components/Chat/Chat";
import Profile from "./components/Profile";
import SideBars from "./components/MainCompo/SideBars";
import Login from "./components/Login/Login";
import Admin from "./components/Admin/Admin";

function Root() {
  return (
    <Router>
      {/*<SideBars />*/}
      <Routes>
        <Route path="/login/twofa" element={<Login twofa={true} />} />
        <Route path="/login" element={<Login twofa={false} />} />
        <Route path="/" element={<SideBars />}>
          <Route index element={<Homepage />} />
          <Route path="game">
            <Route index element={<GameMenu />} />
            <Route path="game" element={<GamePage />} />
          </Route>
          <Route path="chat" element={<Chat />} />
          <Route path="admin" element={<Admin role={"admin"} />} />
          <Route path="owner" element={<Admin role={"owner"} />} />
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
