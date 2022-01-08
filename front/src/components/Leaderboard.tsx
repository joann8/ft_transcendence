import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";

export default function Leaderboard() {
    console.log("ici ?")
    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <h1> Test Page Adrien</h1>
                </Grid>
            </Grid>
        </Fragment>
    )
}