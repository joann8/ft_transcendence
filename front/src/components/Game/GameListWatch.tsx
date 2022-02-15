import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Avatar, Box, Button, Modal } from "@mui/material";
import { Fragment } from "react";
import GameWatch from "./GameWatch";
import { PropsWatch } from "./GameTypes";
import gameStyles from "./GameStyles";
import { api_url } from "../../ApiCalls/var";

export default function GameList(props: PropsWatch) {
  const navigate = useNavigate();
  let socket = props.socket;
  let watchee = props.watchee;

  // REQUETES ET DATA NECESSAIRES

  const [update, setUpdate] = useState(false);

  const [games, setGames] = useState([]);
  const getGames = async () => {
    await fetch(api_url + "/game/ongoing", {
      method: "GET",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (res.status === 401)
          navigate("/login");
        else if (!res.ok)
          throw new Error(res.statusText);
        return res.json();
      })
      .then((resJson) => {
        setGames(resJson);
      })
      .catch((err) => {
        console.log("Error caught: ", err);
      });
  };

  const [oneGame, setOneGame] = useState(null);
  const getOneGame = async (watchee: string) => {
    await fetch(api_url + `/game/ongoing/${watchee}`, {
      method: "GET",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (res.status === 401)
          navigate("/login");
        else if (!res.ok)
          throw new Error(res.statusText);
        else if (res.status === 204) {
          return {}; // pas de jeu en cours
        } else return res.json();
      })
      .then((resJson) => {
        console.log(resJson);
        setOneGame(resJson);
      })
      .catch((err) => {
        console.log("Error caught: ", err);
      });
  };

  useEffect(() => {
    if (watchee !== "") getOneGame(watchee);
    else getGames();
  }, [update]); // a voir ???

  // GESTION MODAL ET ALERTES

  const [openWatch, setOpenWatch] = React.useState(false);

  const handleOpenWatch = (room: string) => {
    socket.emit("check_match", room);
  };

  useEffect(() => {
    socket.on("allowed_watch", (room: string) => {
      setOpenWatch(true);
      socket.emit("watch_game", room);
    });
    socket.on("not_allowed_watch", (args: any) => {
      if (watchee === "") {
        alert("This match is over"); // a faire en plus jolie?
        handleUpdate();
      } else {
        alert(`${watchee} is not in a game at the moment`);
        navigate("/game");
      }
      return () => {
        socket.removeAllListeners("allowed_watch");
        socket.removeAllListeners("not_allowed_watch");
      };
    });
  }, []);

  const handleCloseWatch = () => {
    socket.emit("unwatch_game");
    setOpenWatch(false);
    if (watchee !== "") navigate(`/game`);
    else handleUpdate();
  };

  const handleUpdate = () => {
    if (update === false) setUpdate(true);
    else setUpdate(false);
  };

  if (watchee !== "") {
    if (oneGame !== null && oneGame !== {}) handleOpenWatch(oneGame.room);
    return (
      <Fragment>
        <Modal open={openWatch} onBackdropClick={handleCloseWatch}>
          <Box sx={gameStyles.boxModal}>
            <GameWatch socket={socket} user={props.user} mode={"watch"} />
          </Box>
        </Modal>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  {" "}
                  LIVE GAMES{" "}
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
              {games.map((game: any) => (
                <TableRow
                  key={game.id_match}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">
                    {" "}
                    {game.player1.id_pseudo}{" "}
                  </TableCell>
                  <TableCell align="left">
                    {" "}
                    <Avatar src={game.player1.avatar} />{" "}
                  </TableCell>
                  <TableCell align="right">
                    {" "}
                    {game.player2.id_pseudo}{" "}
                  </TableCell>
                  <TableCell align="left">
                    {" "}
                    <Avatar src={game.player2.avatar} />{" "}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpenWatch(game.room)}
                    >
                      {" "}
                      Watch{" "}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal open={openWatch} onBackdropClick={handleCloseWatch}>
          <Box sx={gameStyles.boxModal}>
            <GameWatch socket={socket} user={props.user} mode={"watch"} />
          </Box>
        </Modal>
      </Fragment>
    );
  }
}
