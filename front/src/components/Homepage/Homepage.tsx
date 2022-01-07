import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Copyright from '../MainCompo/Copyright';
import Image from './squidgame.jpg'
import { Fragment } from 'react';
import { Typography } from '@mui/material';

const styles = {
  paperContainer: {
    backgroundImage: `url(`+ `${Image}` + ')',
    backgroundPosition: 'center',
    backgrounfSize: 'cover',
    backgroundRepeat: 'no-repeat',
    flexGrow: 1,
    overflow: 'auto',
   
  }
};

function HomepageCompo() {
  return (       
        <Fragment>
          <Grid container spacing={3}>

          <Paper style={styles.paperContainer}>
            <Typography> Squid Game? </Typography> 
          </Paper>
          <Copyright/>
          </Grid >
         </Fragment>
  );
}

export default function Homepage() {
  return <HomepageCompo />;
}
