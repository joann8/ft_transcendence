import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Image from '../Images/black.jpg'
import { Fragment } from 'react';
import { Button, CardActionArea, Typography } from '@mui/material';

import GameMenu from '../Game/GameMenu';
import GamePage from '../Game/GamePage';
import Game from '../Game';
import { useNavigate } from 'react-router';


export default function Homepage(props: any) {
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

    let navigate = useNavigate()

  return (       
        <Fragment>
          <Paper style={styles.backgroundImage}>
           {/*} <Toolbar />*/}
            <Grid container alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
              <Grid item >
                <Button color="primary" variant="contained" style={{fontSize: 50}} onClick={() => navigate("/game")}> Let's play!</Button>
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
