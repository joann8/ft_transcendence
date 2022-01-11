import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";
import { setFlagsFromString } from "v8";

export default function Login(props : any) {
    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <h1> Login Page</h1>
                    <button type="submit" onClick={() => props.setLogin(true)}> Login </button>
                    <button type="submit" onClick={() => props.setLogin(false)}> Logout </button>
                    <p> Login value : {props.login ? "true" : "false"} </p>
                </Grid>
            </Grid>
        </Fragment>
    )
}