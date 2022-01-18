import { Send } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import LoginMask from "./LoginMask";

export default function Login() {
  return (
    <div>
      <LoginMask />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction={"column"}
        marginTop={15}
        position={"absolute"}
      >
        <Grid item>
          <Button
            variant="contained"
            href="http://127.0.0.1:3001/login/42"
            size="large"
            endIcon={<Send />}
          >
            Login with 42
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  /*return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction={"column"}
      marginTop={3}
    >
      <Grid item>
        <Typography
          variant="h3"
          align="center"
          fontFamily={"Arial Black"}
          marginBottom={4}
        >
          TRANSCENDENCE
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          href="http://127.0.0.1:3001/login/42"
          size="large"
          endIcon={<Send />}
        >
          Login with 42
        </Button>
      </Grid>
      <Paper></Paper>
    </Grid>
  );*/
}
