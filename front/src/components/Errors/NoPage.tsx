
import * as React from 'react';
import Copyright from '../MainCompo/Copyright';
import { Fragment } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Paper } from '@mui/material';
import { Toolbar } from '@mui/material';
import { Grid } from '@mui/material';

function NoPageCompo() {
    const styles = {
      defaultStyle: {
        backgroundColor: 'blue',
        width: '100%',
        height: '100vh',
      }
    };
    
  return (       
        <Fragment>
          <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            width: '100vh',
            overflow: 'auto',
          }}
        >
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
              <Grid item >
                <Typography variant="h2"> No Such Page </Typography> 
              </Grid>
            </Grid>
          </Box>
         </Fragment>
  );
}

export default function NoPage() {
  return <NoPageCompo />;
}
