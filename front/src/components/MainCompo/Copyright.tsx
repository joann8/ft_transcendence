import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';



function CopyrightCompo(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Transcendence Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Copyright(props: any) {
    return <CopyrightCompo />;
  }