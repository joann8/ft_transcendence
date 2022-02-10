import { Container, Grid } from "@mui/material";
import { Box } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import MessageList from "./MessageList";
import ChannelList from "./ChannelList";
import {
  Message,
  Channel,
  userChannelRole,
  User,
  ServerToClientEvents,
  ClientToServerEvents,
} from "./types";
import RoleList from "./RoleList";
import back from "./backConnection";
import CreateChannel from "./CreateChannel";
import { io, Socket } from "socket.io-client";
import { Context } from "../MainCompo/SideBars";

function Chat() {
  /*
   *   REFS
   */

  /*
   *   STATES
   */
  const [socket, setSocket] =
    React.useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [channelList, setChannelList] = React.useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = React.useState<Channel>();

  //const [currentUser, setCurrentUser] = React.useState<User>();
  const currentUser = React.useContext(Context).user;
  /** BACK END CALLS */

  const fetchChannelList = async () => {
    const result = await back
      .get("http://127.0.0.1:3001/channel/me")
      .catch((error) => alert(error.response.data.message));
    if (!result) return;
    console.log(result.data);
    setChannelList(result.data);
    setCurrentChannel(result.data[0]);
  };

  /*async function fetchCurrentUser() {
    const result = await back
      .get("http://127.0.0.1:3001/user")
      .catch((error) => alert(error.response.data.message));
    if (!result) return;

    setCurrentUser(result.data);
  }*/

  /*
   *   HOOKS
   */

  React.useEffect(() => {
    //fetchCurrentUser();
    fetchChannelList();
  }, []);

  React.useEffect(() => {
    const newSocket = io(`http://127.0.0.1:3001/channel`);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [setSocket]);

  /*
   *   FUNCTIONS
   */

  /*
   *   RENDER
   */
  if (currentChannel)
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
          <Grid container columnSpacing={1} rowSpacing={0}>
            <ChannelList
              currentUser={currentUser}
              currentChannel={currentChannel}
              changeChannel={setCurrentChannel}
              channelList={channelList}
              setChannelList={setChannelList}
              fetchChannelList={fetchChannelList}
            ></ChannelList>
            {socket ? (
              <MessageList
                socket={socket}
                currentChannel={currentChannel}
                currentUser={currentUser}
              ></MessageList>
            ) : (
              <div>Not Connected</div>
            )}

            <RoleList
              currentUser={currentUser}
              currentChannel={currentChannel}
            ></RoleList>
          </Grid>
        </Container>
      </Box>
    );
  else
    return <CreateChannel fetchChannelList={fetchChannelList}></CreateChannel>;
}

export default Chat;
