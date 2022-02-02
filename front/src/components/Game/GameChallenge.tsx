import * as React from 'react';
import { useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Fragment } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, Modal } from '@mui/material';
import GamePong from './GamePong';
import gameStyles from './GameStyles';
import { PropsChallenge, PropsInit } from './GameTypes';
import { useNavigate } from 'react-router';

export default function GameChallenge(props : PropsChallenge) {
    
    const navigate = useNavigate();

    let socket = props.socket;
    let userID = props.user;
    let challengee = props.challengee;
    
    const updateStatus = async (newStatus : string) => {
      await fetch(`http://127.0.0.1:3001/user/`, {
        method: "PUT",
        credentials : "include",
        referrerPolicy: "same-origin",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status: `${newStatus}`}),
      })
    };

    useEffect(() => {
      console.log("open defy");
      console.log("challenger: ", userID.id_pseudo);
      console.log("challengee: ", challengee.id_pseudo);
      updateStatus("INGAME");

      socket.emit("create_challenge", {challenger : userID, challengee : challengee});
    }, []);
        
    const handleCloseGame = () => {
      setOpenAlert(true);
    }

    const [openAlert, setOpenAlert] = useState(false);
    
    const handleCloseAlertStay = () => {
      setOpenAlert(false);
    }
    
    const handleCloseAlertLeave = () => {
      socket.emit('my_disconnect'); // a revoir dans le back
      updateStatus("ONLINE");
      setOpenAlert(false);
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
                      <GamePong width={800} height={600} socket={socket} user={userID} mode={"challenge"}/>
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

