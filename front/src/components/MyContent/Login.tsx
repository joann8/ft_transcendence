import { Toolbar, Grid } from "@mui/material";
import { count } from "console";
import React, { Fragment } from "react";
import { Outlet } from "react-router";

export default function Login(props : any) {

  //Deals with Tom's back end to check Authentication
  function handleLogin ()
  {
    //const authSuccess = checkWithBackend()
    const authSuccess = true
    if (authSuccess)
      props.setLogin(true)

  }
    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <h1> Login Page</h1>
                    code pour modifier URL
                    <button type="submit" onClick={() => handleLogin()}> Login </button>
                    <p> {`Logout code was executed : ${count} times`} </p>
                </Grid>
            </Grid>
        </Fragment>
    )
}