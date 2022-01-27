import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Fragment } from 'react';
import LeaderTable from './LeaderTable';
import gameStyles from '../Game/GameStyles';

export default function Leaderboard() {   
   
  return (       
        <Fragment>
            <Paper style={gameStyles.backgroundImage}>
             <Toolbar />
             <Grid container spacing={2}  alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                  <LeaderTable />
                </Grid>
                <Grid item xs={2}/>
              </Grid>
              </Paper>
          </Fragment>);
}

