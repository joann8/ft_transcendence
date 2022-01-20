import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Image from '../Images/game.jpg'
import { Fragment } from 'react';
import { Typography } from '@mui/material';
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
    };

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
             {/*} <Toolbar />*/}
                <Grid container spacing={2}  alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
                    <Grid item xs={12} style={{textAlign: "center"}} >
                        <Typography> PONG GAME</Typography>
                    </Grid>
                    <Grid item xs={12} >
                      <Container className={classes.gameWindow} >
                        <Typography> Game Window </Typography>
                        {object}
                        {/* GamePong width={800} height={600} />*/}
                      </Container>
                    </Grid>
                    <RuleSet />
                </Grid>
            </Paper>
        </Fragment>
  );
}
