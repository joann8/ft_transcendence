import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";

export default function Test() {
    console.log("ici ?")
    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                <h1> This is the 
                        <strong> Profile </strong> 
                        page 
                    </h1>
                </Grid>
            </Grid>
        </Fragment>
    )
}