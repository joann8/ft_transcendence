
import * as React from 'react';
import { useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Fragment } from 'react';
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Typography } from '@mui/material';
import RuleSet from '../Game/RuleSet';
import { makeStyles } from '@mui/styles';
import GamePong from '../Game/GamePong';
import GameWatch from '../Game/GameWatch';
import socket from './socket';
import { useNavigate } from 'react-router';
import GameList from '../Game/GameList';
import gameStyles from '../Game/GameStyles';
import { useState } from 'react';
import { io } from "socket.io-client";



export default function GamePage() {
    
    const navigate = useNavigate();

    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const connect = async () => {
      const newSocket = io("http://127.0.0.1:3001/game", {
	reconnectionDelayMax : 2000,
});
      setSocket(newSocket);
    }
    connect();
    /*  return () => {
        newSocket.disconnect();
      };*/

    }, []);

    const [userID, setUserID] = useState({});

    useEffect(() => {
        const getUserId = async () => {
        fetch("http://127.0.0.1:3001/user", {
            method: "GET",
            credentials : "include",
            referrerPolicy: "same-origin"
        })
        .then((res) => {
            if (res.status === 401)
                navigate("/login");
            else if (!res.ok)
                throw new Error(res.statusText);
            return (res.json());
        })
        .then((resJson) => {
            console.log(`pseudo : ${resJson.id_pseudo} | id : ${resJson.id}`);
            setUserID(resJson);
        })
        .catch((err) => {
            console.log("Error caught: ", err);
        })
        };
        getUserId();
    },[]);
    
    const [openGame, setOpenGame] = React.useState(false);
    const handleOpenGame = async () => {
      socket.emit("check_game", userID);
    }

    useEffect(() => {
        socket.on("allowed", (args : any) => {
          setOpenGame(true);
        });
        socket.on("not_allowed_playing", (args : any) => {
          alert("already playing");
        });
        socket.on("not_allowed_queue", (args : any) => {
          alert("already in queue");
        })
    })

    const handleCloseGame = () => {
      console.log("hanCloseGame called");
      setOpenAlert(true);
    }

   // const classes = useStyle(); 

    const [openAlert, setOpenAlert] = React.useState(false);
    
    const handleCloseAlertStay = () => {
      setOpenAlert(false);
    }
    
    const handleCloseAlertLeave = () => {
      socket.emit('my_disconnect');
      setOpenGame(false);
      setOpenAlert(false);
    };

    // Is it useful?
    useEffect(() => {
      window.addEventListener('beforeRemove', (e) => {
        console.log("pressed arrow back")
        e.preventDefault();
        if (openGame === true)
          handleCloseGame();
      });
    });
   
  return (       
        <Fragment>
            <Paper style={gameStyles.backgroundImage}>
             
             <Toolbar />
             <Grid container spacing={2}  alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
              <Grid item xs={12} style={{textAlign: "center"}}>
               <Button variant="contained" onClick={handleOpenGame} style={{fontSize: 35}}>Play Random</Button>
              <Modal open={openGame} onBackdropClick={handleCloseGame} >
                  <Box sx={gameStyles.boxModal}>
                    <GamePong width={800} height={600} socket={socket} user={userID}/>
                    <Dialog open={openAlert} onClose={handleCloseAlertStay} >
                      <DialogTitle> {"Leave current Pong Game?"} </DialogTitle>
                      <DialogActions>
                        <Button onClick={handleCloseAlertStay}>Disagree</Button>
                        <Button onClick={handleCloseAlertLeave} autoFocus>Agree</Button>
                      </DialogActions>
                     </Dialog>
                  </Box>
                </Modal>
                {/*
                <Modal open={openWatch} onBackdropClick={handleCloseWatch}>
                  
                  <Box sx={gameStyles.boxModal}>
                    <GameWatch width={800} height={600} socket={socket} user={userID}/>
                  </Box>
                </Modal>
                */}
                </Grid>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                  <GameList width={800} height={600} socket={socket} user={userID}/>
                </Grid>
                <Grid item xs={2}/>
                <Grid item xs={12} >
                  <RuleSet />
                </Grid>
              </Grid>
              </Paper>
          </Fragment>);
}

