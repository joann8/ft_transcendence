import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Image from '../Images/game.jpg'
import { Fragment } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import RuleSet from './RuleSet';
import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import GamePong from './GamePong';
import { useLocation } from 'react-router';
import GameWatch from './GameWatch';

const useStyle = makeStyles({
  gameWindow: {
    width: "98%",
    height: "70vh",
    backgroundColor: "yellow",
    textAlign: "center",
    FormatAlignJustify: "center"
  }
});

export default function GamePage() {
  const styles = {
    backgroundImage: {
      backgroundImage: `url(`+ `${Image}` + ')',
      backgroundPosition: 'left',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
     // backgroundColor: 'grey',
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
    boxModal: {
      align: 'center',
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    }
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const classes = useStyle(); 

    let object;
    const location = useLocation();
    console.log(location);
    
    if (location.pathname === "/game/pong")
      object = <GamePong width={800} height={600} />;
    else if (location.pathname === "/game/watch")
      object = <GameWatch width={800} height={600} />;

    return (       
        <Fragment>
            <Paper style={styles.backgroundImage}>
             
             <Toolbar />
             <Grid container spacing={2}  alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
              <Grid item xs={12} style={{textAlign: "center"}}>
              <Button onClick={handleOpen}>Open modal</Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={styles.boxModal}>
                    {object}
                    </Box>
                  </Modal>
                </Grid>
                <Grid item xs={12} >
                  <RuleSet />
                </Grid>
              </Grid>
              </Paper>
          </Fragment>);
}

/*

  
                <Grid container spacing={2}  alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
                    <Grid item xs={12} style={{textAlign: "center"}} >
                        <Typography> PONG GAME</Typography>
                    </Grid>
                    <Grid item xs={12} >
                      <Container className={classes.gameWindow} >
                        <Typography> Game Window </Typography>
                        {object}
                        {/* GamePong width={800} height={600} />
                      </Container>
                    </Grid>
                    <RuleSet />
                </Grid>
            </Paper>

        </Fragment>
   */
