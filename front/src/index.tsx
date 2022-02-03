import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import NoPage from "./components/Errors/NoPage";
import Game from "./components/Game/Game";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Chat from "./components/Chat/Chat";
import Profile from "./components/Profile/Profile";
import SideBars from "./components/MainCompo/SideBars";
import Login from "./components/Login/Login";
import OtherUser from "./components/Profile/OtherUser";

function Root() {
  return (
    <Router>
      {/*<SideBars />*/}
      <Routes>
        <Route path="/login/twofa" element={<Login twofa={true} />} />
        <Route path="/login" element={<Login twofa={false} />} />
        <Route path="/" element={<SideBars />}>
          <Route index element={<Homepage />} />
          <Route path="game" >
            <Route index element={<Game mode={"random"}/>} />
            <Route path="challenge" >
              <Route path=":id" element={<Game mode={"challenge"} />} /> 
            </Route>
            <Route path="watch" >
              <Route path=":id" element={<Game  mode={"watch"}/> } /> 
            </Route>
          </Route>
          <Route path="chat" element={<Chat />} />
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path=":id_pseudo" element={<OtherUser/>} />
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
  {/*  <socketContext.Provider value={socket}>*/}
    <Root />
  {/*</socketContext.Provider>*/}
  </React.StrictMode>,
  document.getElementById("root")
);
