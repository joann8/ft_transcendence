import { Container, Grid, Typography } from "@mui/material";
import { Box, width } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import CurrentChat from "./CurrentChat";
import ChatRooms from "./ChatRooms";
import { makeStyles } from "@mui/styles";
import ChatUsers from "./ChatUsers";

function Chat() {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container disableGutters maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <ChatRooms></ChatRooms>
          <CurrentChat />
          <ChatUsers></ChatUsers>
        </Grid>
      </Container>
    </Box>
  );
}

export default Chat;
