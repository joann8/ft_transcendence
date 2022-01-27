import * as React from 'react';
import { useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Fragment } from 'react';
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Typography } from '@mui/material';
import RuleSet from './RuleSet';
import { makeStyles } from '@mui/styles';
import GamePong from './GamePong';
import GameWatch from './GameWatch';
import socket from './socket';
import { useNavigate } from 'react-router';
import GameList from './GameList';
import gameStyles from './GameStyles';

export default function GamePage() {
  
  
    //const navigate = useNavigate();

    const [openGame, setOpenGame] = React.useState(false);
    const handleOpenGame = async () => {
      setOpenGame(true);

      /*
      const getUserStatus = async () => {
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
            if (resJson.status === "ONLINE")
              setOpenGame(true);
            else
              alert("Busy busy")
        })
        .catch((err) => {
            console.log("Error caught: ", err);
        })
      };
        getUserStatus();
      };  
    */}

    const handleCloseGame = () => {
      console.log("hanCloseGame called");
      setOpenAlert(true);
    }

    const [openWatch, setOpenWatch] = React.useState(false);
    const handleOpenWatch = () => {
       setOpenWatch(true);
    }
    const handleCloseWatch= () => {
      console.log("hanCloseWatch called")
      socket.emit('unwatch_game');
      setOpenWatch(false);
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
        else if (openWatch === true)
          handleCloseWatch();
      });
    });
   
  return (       
        <Fragment>
            <Paper style={gameStyles.backgroundImage}>
             
             <Toolbar />
             <Grid container spacing={2}  alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
              <Grid item xs={12} style={{textAlign: "center"}}>
              <ButtonGroup variant="contained"  aria-label="outlined primary button group">
                  <Button onClick={handleOpenGame} style={{fontSize: 35}}>Play Random</Button>
                  <Button onClick={handleOpenWatch} style={{fontSize: 35}}>Watch a Game </Button>
                  <Button style={{fontSize: 35}}>Find a friend</Button>
              </ButtonGroup>
              <Modal open={openGame} onBackdropClick={handleCloseGame} >
                  <Box sx={gameStyles.boxModal}>
                    <GamePong width={800} height={600} socket={socket}/>
                    <Dialog open={openAlert} onClose={handleCloseAlertStay} >
                      <DialogTitle id="alert-dialog-title">
                        {"Leave current Pong Game?"}
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={handleCloseAlertStay}>Disagree</Button>
                        <Button onClick={handleCloseAlertLeave} autoFocus>Agree</Button>
                      </DialogActions>
                     </Dialog>
                  </Box>
                </Modal>
                <Modal open={openWatch} onBackdropClick={handleCloseWatch}>
                  
                  <Box sx={gameStyles.boxModal}>
                    <GameWatch width={800} height={600} socket={socket}/>
                  </Box>
                </Modal>
                </Grid>
                <Grid item xs={12}>
                  <GameList width={800} height={600} socket={socket}/>
                </Grid>
                <Grid item xs={12} >
                  <RuleSet />
                </Grid>
              </Grid>
              </Paper>
          </Fragment>);
}

