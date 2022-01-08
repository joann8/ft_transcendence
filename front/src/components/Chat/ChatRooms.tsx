import { Container, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import * as React from "react";

const useStyle = makeStyles({
  chatRoomsContainer: {
    width: "100%",
    height: "600px",
    backgroundColor: "blue",
  },
});

function ChatRooms() {
  const classes = useStyle();

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Container className={classes.chatRoomsContainer}>
        {" "}
        ZONE DES CHATROOMS
      </Container>
    </Grid>
  );
}

export default ChatRooms;
