import { Container, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import * as React from "react";

const useStyle = makeStyles({
  ChatUsersContainer: {
    width: "100%",
    height: "600px",
    backgroundColor: "purple",
  },
});

function ChatUsers() {
  const classes = useStyle();

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Container className={classes.ChatUsersContainer}>
        {" "}
        ZONE DES ChatUsers
      </Container>
    </Grid>
  );
}

export default ChatUsers;
