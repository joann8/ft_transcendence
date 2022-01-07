import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as React from "react";

const useStyle = makeStyles({
  messagesContainer: {
    height: "450px",
    backgroundColor: "red",
    borderRadius: "10px",
    border: "solid",
  },
  formMessageContainer: {
    height: "100px",
    backgroundColor: "yellow",
  },
});

function CurrentChat() {
  const classes = useStyle();
  return (
    <Grid item xs={12} md={4} lg={6}>
      <Grid container rowSpacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <Container className={classes.messagesContainer}>
            LISTE DES MESSAGES
          </Container>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Container className={classes.formMessageContainer}>
            FORMULAIRE MESSAGE
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CurrentChat;
