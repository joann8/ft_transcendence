import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Image from './squidgame.jpg'
import { Fragment } from 'react';
import { Button, CardActionArea, Typography } from '@mui/material';
import Game from '../Game';




//function HomepageCompo(props: any) {
export default function Homepage(props: any) {
  const styles = {
    cardCont: {
      backgroundImage: `url(`+ `${Image}` + ')',
      backgroundPosition: 'left',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      width: '100%',
      height: '100vh',
      overflow: 'auto',
    }
  };
  return (       
        <Fragment>
          <Paper style={styles.cardCont}>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
              <Grid item >
                <Button color="primary" variant="contained" style={{fontSize: 50}} onClick={() => props.handleCanvas(<Game />)}> Let's play!</Button>
              </Grid>
            </Grid>
          </Paper>
         </Fragment>
  );
}

/*
export default function Homepage(props: any) {
  return <HomepageCompo handleCanvas={props.handleCanvas} />;
}
*/
