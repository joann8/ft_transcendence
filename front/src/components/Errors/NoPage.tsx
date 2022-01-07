import * as React from 'react';
import Copyright from '../MainCompo/Copyright';
import { Fragment } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';


function NoPageCompo() {
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
        <Typography variant="h1" align="center"> NO SUCH PAGE </Typography> 
        </Box>
        <Copyright/>
      </Fragment>
  );
}

export default function NoPage() {
  return <NoPageCompo />;
}
