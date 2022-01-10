import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Image from '../Images/heads.jpg'
import { Fragment } from 'react';
import { Button, CardActionArea, Typography } from '@mui/material';
import Game from '../Game';
import RuleSet from './RuleSet';
import SplitButton from './SplitButton';

export default function GameMenu() {
  const styles = {
    backgroundImage: {
      backgroundImage: `url(`+ `${Image}` + ')',
      backgroundPosition: 'left',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      width: '100%',
      height: '100%',
      overflow: 'auto',
    }
  };
  return (       
        <Fragment>
          <Paper style={styles.backgroundImage}>
           {/*} <Toolbar />*/}
           <Grid spacing={2} container alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
              <Grid item xs={6} style={{textAlign: "center"}} >
                <SplitButton buttonNb={0} options={[ "Play against a friend", "Random Play"]} />
                 {/* <Button color="primary" variant="contained" style={{fontSize: 50}} > PLAY</Button>*/}
              </Grid>
              <Grid item xs={6}  style={{textAlign: "center"}}>
                <SplitButton buttonNb={1} options={["Watch a friend", "Random Watch"]} />

               {/* <Button color="primary" variant="contained" style={{fontSize: 50}} > WATCH</Button> */}
              </Grid>
              <RuleSet />
            </Grid>
          </Paper>
         </Fragment>
  );
}
