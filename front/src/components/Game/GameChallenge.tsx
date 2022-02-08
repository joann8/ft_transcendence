import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Fragment } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, Modal } from '@mui/material';
import GamePong from './GamePong';
import gameStyles from './GameStyles';
import { PropsChallenge } from './GameTypes';
import { useNavigate } from 'react-router';
import { Context } from '../MainCompo/SideBars';

export default function GameChallenge(props : PropsChallenge) {
    
    const navigate = useNavigate();
    const [start, setStart] = useState(false);

    const context = useContext(Context);
    const userID = context.user;

    let socket = props.socket;
    let challengee = props.challengee;

    const updateStatus = async (newStatus : string) => {
      await fetch(`http://127.0.0.1:3001/user`, {
        method: "PUT",
        credentials : "include",
        referrerPolicy: "same-origin",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status: `${newStatus}`}),
        }).then((res) => {
          if (!res.ok)
            throw new Error(res.statusText);
          return (res.json());
        }).catch((err) => {
          console.log("Error caught: ", err);
        })
    };

    useEffect(() => {
      socket.emit("check_game", userID);
    }, []);

    useEffect(() => {
        socket.on("allowed", (args : any) => {
          updateStatus("IN QUEUE");
          socket.emit("create_challenge", {challenger : userID, challengee : challengee});
        });
        socket.on("not_allowed_playing", (args : any) => {
          alert('You are already playing'); // a faire en plus jolie?
          navigate('/game');
        });
        socket.on("not_allowed_queue", (args : any) => {
          alert("You are already in queue"); // a faire en plus jolie?
          navigate('/game');
        });
        socket.on('challenge_accepted', (args : any) => {
          updateStatus("IN GAME");
          setStart(true);
        });
        socket.on('challenge_refused', (args : any) => {
          alert("This challenge was refused");
          handleCloseAlertLeave();
        });
        return () => {
          socket.removeAllListeners("allowed");
          socket.removeAllListeners("not_allowed_playing");
          socket.removeAllListeners("not_allowed_queue");
          socket.removeAllListeners("challenge_refused");
          socket.removeAllListeners("challenge_accepted");
        };
    }, [])
      
    const handleCloseGame = () => {      
      setOpenAlert(true);
    }

    const [openAlert, setOpenAlert] = useState(false);
    
    const handleCloseAlertStay = () => {
      setOpenAlert(false);
    }
    
    const handleCloseAlertLeave = () => {
      if (start === false)
        socket.emit('cancel_challenge', {challenger : userID, challengee : challengee});
      socket.emit('my_disconnect');
      updateStatus("ONLINE");
      setOpenAlert(false);
      context.setUpdate(!context.update); // a verifier
      navigate(`/game`);
    }
  
  return (       
        <Fragment>
          <Paper style={gameStyles.backgroundImage}>
            <Toolbar />
              <Grid container spacing={2}  alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
                <Grid item xs={12} style={{textAlign: "center"}}>
                  <Modal open={true} onBackdropClick={handleCloseGame} >
                    <Box sx={gameStyles.boxModal}>
                      <GamePong socket={socket} user={userID} mode={"challenge"}/>
                      <Dialog open={openAlert} onClose={handleCloseAlertStay} >
                        <DialogTitle> {"Leave current Pong Game?"} </DialogTitle>
                        <DialogActions>
                          <Button onClick={handleCloseAlertStay}>Disagree</Button>
                          <Button onClick={handleCloseAlertLeave} autoFocus>Agree</Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  </Modal>
                </Grid>
              </Grid>
            </Paper>
          </Fragment>);
}



