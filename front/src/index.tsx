import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Leaderboard from "./components/Leaderboard";
import Chat from "./components/Chat/Chat";
import Profile from "./components/Profile/Profile";
import SideBars from "./components/MainCompo/SideBars";
import Login from "./components/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoPage from "./components/Errors/NoPage";
import GameMenu from "./components/Game/GameMenu";
import GamePage from "./components/Game/GamePage";
import Homepage from "./components/Homepage/Homepage";
import OtherUser from "./components/Profile/OtherUser";
import Friend from "./components/Friend/Friend";

function Root() {
  return (
    <Router>
      {/*<SideBars />*/}
      <Routes>
        <Route path="/login/twofa" element={<Login twofa={true} />} />
        <Route path="/login" element={<Login twofa={false} />} />
        <Route path="/" element={<SideBars />}>
          <Route index element={<Homepage />} />
          <Route path="friend" element={<Friend />} />
          <Route path="game">
            <Route index element={<GameMenu />} />
            <Route path="game" element={<GamePage />} />
          </Route>
          <Route path="chat" element={<Chat />} />
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path=":id_pseudo" element={<OtherUser />} />
          </Route>
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
