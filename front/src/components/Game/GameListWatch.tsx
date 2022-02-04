import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Navigate, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Alert, Avatar, Box, Button, Modal, styled } from '@mui/material';
import { Fragment } from 'react';
import { Socket } from 'socket.io-client';
import GameWatch from './GameWatch';
import { PropsWatch } from './GameTypes';
import gameStyles from './GameStyles';


export default function GameList(props : PropsWatch) {
  
  const navigate = useNavigate();
  let socket = props.socket;
  let watchee = props.watchee;

  // REQUETES ET DATA NECESSAIRES 

  const [update, setUpdate] = useState(false);

  const [games, setGames] = useState([]);
  const getGames = async () => {
    await fetch("http://127.0.0.1:3001/game/ongoing", {
          method: "GET",
          credentials : "include",
          referrerPolicy: "same-origin"
      })
      .then((res) => {
          console.log("return from database all games:", res.status)
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
  
  const [oneGame, setOneGame] = useState(null);
  const getOneGame = async (watchee : string) => {
    await fetch(`http://127.0.0.1:3001/game/ongoing/${watchee}`, {
        method: "GET",
        credentials : "include",
        referrerPolicy: "same-origin"
    })
    .then((res) => {
        console.log("return from database One game:", res.status)
        console.log("res ok? :", res.ok)
        if (res.status === 401)
            console.log("oupsy");
        else if (!res.ok)
            throw new Error(res.statusText);
        else if (res.status === 204)
        {
          console.log("reno res");
          return({})
        }
        else
          return (res.json());
    })
    .then((resJson) => {
        console.log(resJson);
        setOneGame(resJson);
    })
    .catch((err) => {
        console.log("Error caught: ", err);
    })
  };
    
  useEffect(() => {
    if (watchee !== "")
      getOneGame(watchee);
    else
      getGames();
    }, [update]); // a voir ??? 


  // GESTION MODAL ET ALERTES 

  const [openWatch, setOpenWatch] = React.useState(false);
  
  const handleOpenWatch = (room : string) => {
    socket.emit("check_match", room);
  };
  
  useEffect(() => {
      socket.on("allowed_watch", (room: string) => {
        setOpenWatch(true);
        socket.emit('watch_game', room);
      });
      socket.on("not_allowed_watch", (args : any) => {
        console.log("match over received")
        alert("This match is over"); // a faire en plus jolie?
        handleUpdate();
      });
     
  }, []);

  const handleCloseWatch= () => {
    console.log("hanCloseWatch called")
    socket.emit('unwatch_game');
    setOpenWatch(false);
    if (watchee !== "")
      navigate(`/game`);
    else
      handleUpdate();
  }

  const handleUpdate=() => {
    if (update === false)
      setUpdate(true);
    else
      setUpdate(false);
  }
 
  if (watchee !== "")
  {
    if (oneGame === {})
    {
      alert("This game is over");
            navigate("/game")
    }
    if (oneGame !== null && oneGame !== {}) 
      handleOpenWatch(oneGame.room);
    return(
        <Fragment>
            <Modal open={openWatch} onBackdropClick={handleCloseWatch}>               
                <Box sx={gameStyles.boxModal}>
                  <GameWatch width={props.width} height={props.height} socket={socket} user={props.user} mode={"watch"}/>
                </Box>
            </Modal>
        </Fragment>
      )
  }
  else
  {
    return (
      <Fragment> 
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={4}> LIVE GAMES </TableCell>
                  <TableCell align="right" colSpan={1}>
                      <Button variant="outlined" color="secondary" onClick={handleUpdate}> Update List Game </Button>
                  </TableCell>             
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((game : any) => (
                  <TableRow
                    key={game.id_match}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right"> {game.player1.id_pseudo} </TableCell>
                    <TableCell align="left"> <Avatar src={game.player1.avatar} /> </TableCell>
                    <TableCell align="right"> {game.player2.id_pseudo} </TableCell>
                    <TableCell align="left"> <Avatar src={game.player2.avatar} /> </TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" color="secondary" onClick={() => handleOpenWatch(game.room)}> Watch </Button>
                    </TableCell>            
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal open={openWatch} onBackdropClick={handleCloseWatch}>               
            <Box sx={gameStyles.boxModal}>
              <GameWatch width={props.width} height={props.height} socket={socket} user={props.user} mode={"watch"}/>
            </Box>
        </Modal>
      </Fragment>
    )
  }
};