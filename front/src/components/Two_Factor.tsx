import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";

export default function TwoFactor() {
    console.log("Recevoir le QR depuis TOM")
    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <h1> Two_factor page</h1>
                    <br/>
                    <h2> Scan the QR code </h2>
                </Grid>
            </Grid>
        </Fragment>
    )
}