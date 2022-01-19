import { Send } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import React from "react";
import LoginMask from "./LoginMask";

export default function Login() {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction={"column"}
      marginTop={29}
      position={"relative"}
    >
      <LoginMask />
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
  );
}
