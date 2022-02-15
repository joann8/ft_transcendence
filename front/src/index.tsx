import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import NoPage from "./components/Errors/NoPage";
import Game from "./components/Game/Game";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Chat from "./components/Chat/Chat";
import Profile from "./components/Profile/Profile";
import SideBars from "./components/MainCompo/SideBars";
import Login from "./components/Login/Login";
import OtherUser from "./components/Profile/OtherUser";
import Friend from "./components/Friend/Friend";
import { createTheme, ThemeProvider } from "@mui/material";
import Dashboard from "./components/Admin/Dashboard";
import EditPage from "./components/MainCompo/EditPage";
import Registration from "./components/Login/Registration";
import { api_url } from "./ApiCalls/var";
import { useCookies } from "react-cookie";

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#F185A3", //'#29ADB4' // //'#E8C0C0'
    },
  },
});

function Root() {
  const [cookies, setCookie] = useCookies(["access_token"]);
  console.log(cookies);

  React.useEffect(() => {
    if (cookies.access_token) {
      window.addEventListener("beforeunload", (e) => {
        e.preventDefault();
        fetch(api_url + "/user", {
          method: "PUT",
          credentials: "include",
          referrerPolicy: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "OFFLINE" }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(res.statusText);
            }
          })
          .catch((err) => {
            console.error(err.message);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Router>
        <Routes>
          <Route path="/login/twofa" element={<Login twofa={true} />} />
          <Route path="/login" element={<Login twofa={false} />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={<SideBars theme={mdTheme} />}>
            <Route index element={<Homepage theme={mdTheme} />} />
            <Route path="edit" element={<EditPage />} />
            <Route path="game">
              <Route index element={<Game mode={"random"} />} />
              <Route path="challenge">
                <Route index element={<Navigate to="/game" />} />
                <Route path=":id" element={<Game mode={"challenge"} />} />
              </Route>
              <Route path="watch">
                <Route index element={<Navigate to="/game" />} />
                <Route path=":id" element={<Game mode={"watch"} />} />
              </Route>
            </Route>
            <Route path="friend" element={<Friend />} />
            <Route path="chat" element={<Chat />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile">
              <Route index element={<Profile />} />
              <Route path=":id_pseudo" element={<OtherUser />} />
            </Route>
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default Root;

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
