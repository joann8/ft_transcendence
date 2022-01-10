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

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          {/*<Route index element={<Homepage />} />*/}
          <Route path="mycontent" element={<MyContent />} />
          <Route path="game" element={<GameMenu />} />
          <Route path="game/play" element={<GamePage />} />
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
