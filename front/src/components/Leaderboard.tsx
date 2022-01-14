import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";

export default function Leaderboard() {
    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <h1> Test Page LeaderBoard</h1>
                </Grid>
            </Grid>
        </Fragment>
    )
}