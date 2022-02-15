import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  Modal,
} from "@mui/material";
import { Fragment } from "react";
import { PropsGame } from "./GameTypes";
import gameStyles from "./GameStyles";
import GamePong from "./GamePong";
import { Context } from "../MainCompo/SideBars";
import { api_url } from "../../ApiCalls/var";
import { useNavigate } from "react-router";

export default function GameListChallenge(props: PropsGame) {
  let context = useContext(Context);
  let socket = props.socket;
  const navigate = useNavigate();


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
          throw new Error("You must login")
        }
        else if (!res.ok)
          throw new Error(res.statusText);
        return res.json();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const [update, setUpdate] = useState(false);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const getChallenges = async () => {
      await fetch(api_url + `/game/challenge/toanswer/`, {
        method: "GET",
        credentials: "include",
        referrerPolicy: "same-origin",
      })
        .then((res) => {
          if (res.status === 401) 
          {
            navigate("/login");
            throw new Error("You must login")
          }
          else if (!res.ok)
            throw new Error(res.statusText);
          return res.json();
        })
        .then((resJson) => {
          setChallenges(resJson);
        })
        .catch((err) => {
          alert(err);
        });
    };
    getChallenges();
  }, [update]);

  const [openChallenge, setOpenChallenge] = React.useState(false);

  const startChallenge = (id_challenge: number) => {
    updateStatus("IN GAME");
    setOpenChallenge(true);
    handleUpdate();
    socket.emit("answer_challenge", {
      id_challenge: id_challenge,
      answer: "accepted",
    });
  };

  const refuseChallenge = (id_challenge: number) => {
    socket.emit("answer_challenge", {
      id_challenge: id_challenge,
      answer: "refused",
    });
    handleUpdate();
  };

  const handleUpdate = () => {
    setUpdate(!update);
  };

  const handleCloseChallenge = () => {
    setOpenAlert(true);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleCloseAlertStay = () => {
    setOpenAlert(false);
  };

  const handleCloseAlertLeave = () => {
    socket.emit("my_disconnect");
    updateStatus("ONLINE");
    setOpenChallenge(false);
    setOpenAlert(false);
    setUpdate(!context.update); // a verifier
  };

  useEffect(() => {
    socket.on("no_such_challenge", (args: any) => {
      socket.emit("my_disconnect");
      updateStatus("ONLINE");
      setOpenChallenge(false);
      alert("Challenger cancelled the challenge");
    });
    return () => {
      socket.removeAllListeners("no_such_challenge");
    };
  }, []);

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                {" "}
                CHALLENGES{" "}
              </TableCell>
              <TableCell align="right" colSpan={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleUpdate}
                >
                  {" "}
                  Update{" "}
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((challenge: any) => (
              <TableRow
                key={challenge.id_challenge}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">
                  {" "}
                  {challenge.challenger.id_pseudo}{" "}
                </TableCell>
                <TableCell align="left">
                  {" "}
                  <Avatar src={challenge.challenger.avatar} />{" "}
                </TableCell>
                <TableCell align="center">
                  <ButtonGroup variant="outlined">
                    <Button
                      color="success"
                      onClick={() => startChallenge(challenge.id_challenge)}
                    >
                      {" "}
                      Accept{" "}
                    </Button>
                    <Button
                      color="error"
                      onClick={() => refuseChallenge(challenge.id_challenge)}
                    >
                      {" "}
                      Decline{" "}
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openChallenge} onBackdropClick={handleCloseChallenge}>
        <Box sx={gameStyles.boxModal}>
          <GamePong socket={socket} user={props.user} mode={"challenge"} />
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
    </Fragment>
  );
}
