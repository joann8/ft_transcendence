import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";

export default function Login(props: any) {
  function handleLogin() {
    window.location.href = "http://127.0.0.1:3001/login/42";
  }
  return (
    <Fragment>
      <Toolbar />
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <h1 className="Login-Title">TRANSCENDENCE</h1>
          <button type="submit" onClick={() => handleLogin()}>
            {" "}
            Login{" "}
          </button>
        </Grid>
      </Grid>
    </Fragment>
  );
}
