import * as React from "react";
import { useEffect, useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Fragment } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Modal,
} from "@mui/material";
import RuleSet from "./RuleSet";
import GamePong from "./GamePong";
import GameList from "./GameListWatch";
import gameStyles from "./GameStyles";
import { PropsInit } from "./GameTypes";
import GameListChallenge from "./GameListChallenge";
import { api_url } from "../../ApiCalls/var";
import { useNavigate } from "react-router";

export default function GameMenu(props: PropsInit) {
  let socket = props.socket;
  let userID = props.user;
  const navigate = useNavigate();

  const [openGame, setOpenGame] = useState(false);
  const handleOpenGame = async () => {
    socket.emit("check_game", userID);
  };

  const updateStatus = async (newStatus: string) => {
    await fetch(api_url + `/user`, {
      method: "PUT",
      credentials: "include",
      referrerPolicy: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: `${newStatus}` }),
    })
      .then((res) => {
        if (res.status === 401) 
        {
          navigate("/login");
          throw new Error("Unauthorized")
        }
        else if (!res.ok)
          throw new Error(res.statusText);
        return res.json();
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    socket.on("allowed", (args: any) => {
      updateStatus("IN QUEUE");
      setOpenGame(true);
    });
    socket.on("not_allowed_playing", (args: any) => {
      alert("You are already playing"); // a faire en plus jolie?
    });
    socket.on("not_allowed_queue", (args: any) => {
      alert("You are already in queue"); // a faire en plus jolie?
    });
    socket.on("start_game", (args: any) => {
      updateStatus("IN GAME");
    });
    return () => {
      socket.removeAllListeners("allowed");
      socket.removeAllListeners("not_allowed_playing");
      socket.removeAllListeners("not_allowed_queue");
      socket.removeAllListeners("start_game");
    };
  }, []);

  const handleCloseGame = () => {
    setOpenAlert(true);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleCloseAlertStay = () => {
    setOpenAlert(false);
  };

  const handleCloseAlertLeave = () => {
    socket.emit("my_disconnect");
    updateStatus("ONLINE");
    setOpenGame(false);
    setOpenAlert(false);
  };

  const [openChallenge, setOpenChallenge] = useState(false);
  const handleCloseChallenges = () => {
    setOpenChallenge(false);
  };
  const handleOpenChallenges = () => {
    setOpenChallenge(true);
  };

  return (
    <Fragment>
      <Paper style={gameStyles.backgroundImage}>
        <Toolbar />
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          style={{ height: "100vh" }}
        >
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={handleOpenGame}
              style={{ fontSize: 35 }}
            >
              Play Random
            </Button>
            <Modal open={openGame} onBackdropClick={handleCloseGame}>
              <Box sx={gameStyles.boxModal}>
                <GamePong socket={socket} user={userID} mode={"random"} />
                <Dialog open={openAlert} onClose={handleCloseAlertStay}>
                  <DialogTitle> {"Leave current Pong Game?"} </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleCloseAlertStay}>Disagree</Button>
                    <Button onClick={handleCloseAlertLeave} autoFocus>
                      Agree
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={handleOpenChallenges}
              style={{ fontSize: 35 }}
            >
              {" "}
              Challenges{" "}
            </Button>
            <Modal open={openChallenge} onBackdropClick={handleCloseChallenges}>
              <Box sx={gameStyles.boxModal}>
                <GameListChallenge
                  socket={socket}
                  user={userID}
                  mode={"challenge"}
                />
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <GameList
              socket={socket}
              user={userID}
              mode={"watch"}
              watchee={""}
            />
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={12}>
            <RuleSet />
          </Grid>
        </Grid>
      </Paper>
    </Fragment>
  );
}
