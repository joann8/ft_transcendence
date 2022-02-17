import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Avatar,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IUser } from "./profileStyle";
import { api_url } from "../../ApiCalls/var";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85%",
  height: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
//Creer l'interface MATCH

interface IMatch {
  id_match: number;
  player1: IUser;
  scorePlayer1: number;
  player2: IUser;
  scorePlayer2: number;
  room: string;
  status: string;
  date: Date;
}


export default function MatchModal({ setModal, modalState, user }) {
  const [history, setHistory] = useState<IMatch[]>(null);
  const navigate = useNavigate();

  const getHistory = async () => {
    await setTimeout(() => { }, 30000);
    await fetch(api_url + `/game/history/${user.id_pseudo}`, {
      credentials: "include",
      referrerPolicy: "same-origin",
      method: "GET",
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login")
         throw new Error("Unauthorized")
        }
        else if (!res.ok)
          throw new Error(res.statusText);
        return res.json();
      })
      .then((resData) => {
        //Met le joueur au player one
        for (let i = 0; i < resData.length; i++) {
          if (user.id_pseudo !== resData[i].player1.id_pseudo) {
            const tmpPlayer = resData[i].player1;
            const tmpScore = resData[i].scorePlayer1;
            resData[i].player1 = resData[i].player2;
            resData[i].scorePlayer1 = resData[i].scorePlayer2;
            resData[i].player2 = tmpPlayer;
            resData[i].scorePlayer2 = tmpScore;
          }
        }
        setHistory(resData);
      })
      .catch((err) => {
        alert(`${err}`);
      });
  }

  useEffect(() => {
    getHistory();
  }, []);

  function getMyDate(dbDate: Date): string {
    const date = new Date(dbDate);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const fullDate = `${day} / ${month} / ${year}`;
    return fullDate;
  }

  function getResult(match: IMatch): string {
    const result = match.scorePlayer1 - match.scorePlayer2;
    if (result === 0) return "Draw";
    else if (result > 0) return "Victory";
    else return "Defeat";
  }

  const handleClose = () => setModal(false);

  function MatchTable() {
    return (
      <React.Fragment>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center"> Date</TableCell>
                <TableCell align="center" colSpan={2}>
                  {" "}
                  Player One{" "}
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  {" "}
                  Player Two
                </TableCell>
                <TableCell align="center"> Result </TableCell>
                <TableCell align="center"> Score </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((match: IMatch) => (
                <TableRow
                  key={match.id_match}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{getMyDate(match.date)}</TableCell>
                  <TableCell align="right">{match.player1.id_pseudo}</TableCell>
                  <TableCell align="left">
                    <Avatar src={match.player1.avatar} />
                  </TableCell>
                  <TableCell align="right">{match.player2.id_pseudo}</TableCell>
                  <TableCell align="left">
                    <Avatar src={match.player2.avatar} />
                  </TableCell>

                  <TableCell align="center">{getResult(match)}</TableCell>
                  <TableCell align="center">
                    {match.scorePlayer1} - {match.scorePlayer2}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Modal
        open={modalState}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>{history ? <MatchTable /> : <CircularProgress />}</div>
        </Box>
      </Modal>
    </div>
  );
}
