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
                <Button variant="contained" color="secondary" onClick={handleClick}>
                    What are the rules?
                </Button>
                <Popper id={id} open={open} anchorEl={anchorEl}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper', textAlign: "center" }}>
                        Those are the rules of PONG.
                        <br/>
                        You must flip tha ball
                        <br/>
                        balabnalalallalaa
                        <br/>
                        Yon win when you reach score of 10.
                        <br/>
                        Yon win when you reach score of 10.
                        <br/>
                        Yon win when you reach score of 10.
                        <br/>
                        Yon win when you reach score of 10.
                    </Box>
                </Popper>
            </Grid>
        </Fragment>
    )
}