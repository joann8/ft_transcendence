import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

export default function GameList() {
   
  const [games, setGames] = useState([]);

  useEffect(() => {
      const getGames = async () => {
      fetch("http://127.0.0.1:3001/game/ongoing", {
          method: "GET",
          credentials : "include",
          referrerPolicy: "same-origin"
      })
      .then((res) => {
          if (res.status === 401)
              console.log("oupsy");
          else if (!res.ok)
              throw new Error(res.statusText);
          return (res.json());
      })
      .then((resJson) => {
          console.log(resJson);
          setGames(resJson);
      })
      .catch((err) => {
          console.log("Error caught: ", err);
      })
      };
      getGames();
  },[]);

  return (
    <TableContainer component={Paper}>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>Player 1</TableCell>
            <TableCell align="right">Player2</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map((game : any) => (
            <TableRow
              key={game.id_match}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row"> {game.player1.id_pseudo} </TableCell>
              <TableCell align="right">{game.player2.id_pseudo} </TableCell>
            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};