import * as React from 'react';
import { Button } from "@mui/material";
import { Fragment } from "react";
import { Popper } from "@mui/material";
import { Box } from "@mui/system";
import { Grid } from '@mui/material';

export default function RuleSet() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(anchorEl ? null : event.currentTarget);
        };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

    return (
        <Fragment >
            <Grid item xs={12}  style={{textAlign: "center"}}  >
                <Button variant="contained" color="secondary" onClick={handleClick} style={{fontSize: 25}}>
                    How to play PONG?
                </Button>
                <Popper id={id} open={open} anchorEl={anchorEl} >
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper', textAlign: "center" }}>
                        The goal is to defeat your oponent by being the first to reach 3 points.
                        <br/>
                        You need to send back the ball to your opponent using your paddle.
                        <br/>
                        Use {String.fromCharCode(9650)} and {String.fromCharCode(9660)} to move your paddle up and down.
                        <br/>
                        You score a point each time your opponent misses the ball.
                        <br/>
                        If one player leaves the game unexpectedly, the second player will win the game (3 - 0).
                    </Box>
                </Popper>
            </Grid>
        </Fragment>
    )
}