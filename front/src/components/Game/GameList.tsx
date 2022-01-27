import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Avatar, Box, Button, Modal, styled } from '@mui/material';
import { Fragment } from 'react';
import { Socket } from 'socket.io-client';
import GameWatch from './GameWatch';
import { PropsGame } from './GameTypes';
import gameStyles from './GameStyles';


export default function GameList(props : PropsGame) {

  let socket = props.socket;

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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const [openWatch, setOpenWatch] = React.useState(false);
  const handleOpenWatch = (room : string) => {
     setOpenWatch(true);
     socket.emit('watch', room);
  }
  const handleCloseWatch= () => {
    console.log("hanCloseWatch called")
    socket.emit('unwatch_game');
    setOpenWatch(false);
  }

  return (
    <Fragment>
      
        <TableContainer component={Paper}>
          <Table >
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Player 1</StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell align="left">Player2</StyledTableCell>
                <StyledTableCell ></StyledTableCell>
                <StyledTableCell ></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((game : any) => (
                <StyledTableRow
                  key={game.id_match}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <StyledTableCell> <Avatar src={game.player1.avatar} /> </StyledTableCell>
                  <StyledTableCell align="left"> {game.player1.id_pseudo} </StyledTableCell>
                  <StyledTableCell> <Avatar src={game.player2.avatar} /> </StyledTableCell>
                  <StyledTableCell align="left"> {game.player2.id_pseudo} </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button variant="outlined" color="secondary" onClick={() => handleOpenWatch(game.room)}> Watch </Button>
                  </StyledTableCell>            
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={openWatch} onBackdropClick={handleCloseWatch}>
                      
        <Box sx={gameStyles.boxModal}>
          <GameWatch width={props.width} height={props.height} socket={socket}/>
        </Box>
      </Modal>
    </Fragment>
  )
};