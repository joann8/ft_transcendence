import * as React from 'react';
import { useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Fragment } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, Modal } from '@mui/material';
import RuleSet from './RuleSet';
import GamePong from './GamePong';
import GameList from './GameList';
import gameStyles from './GameStyles';
import { PropsInit } from './GameTypes';

export default function GameMenu(props : PropsInit) {
    
    let socket = props.socket;
    let userID = props.user;

    const [openGame, setOpenGame] = useState(false);
    const handleOpenGame = async () => {
      socket.emit("check_game", userID);
    }
    useEffect(() => {
        socket.on("allowed", (args : any) => {
          setOpenGame(true);
        });
        socket.on("not_allowed_playing", (args : any) => {
          alert("already playing"); // a faire en plus jolie?
        });
        socket.on("not_allowed_queue", (args : any) => {
          alert("already in queue"); // a faire en plus jolie?
        })
    }, [])

    const handleCloseGame = () => {
      setOpenAlert(true);
    }

    const [openAlert, setOpenAlert] = useState(false);
    
    const handleCloseAlertStay = () => {
      setOpenAlert(false);
    }
    
    const handleCloseAlertLeave = () => {
      socket.emit('my_disconnect'); // a revoir dans le back
      setOpenGame(false);
      setOpenAlert(false);
    };
  
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
                </Grid>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                  <GameList width={800} height={600} socket={socket} user={userID}/>
                </Grid>
                <Grid item xs={2}/>
                <Grid item xs={12}>
                  <RuleSet />
                </Grid>
              </Grid>
            </Paper>
          </Fragment>);
}

