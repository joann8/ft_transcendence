import { Send } from "@mui/icons-material";
import { Grid, Button, Typography, Paper } from "@mui/material";
import React, { Fragment } from "react";
import background from "./bg.jpg";

export default function Login() {
  return (
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
  );
}
