import { Container, Grid } from "@mui/material";
import { Box } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import MessageList from "./MessageList";
import ChannelList from "./ChannelList";
import { Channel, ServerToClientEvents, ClientToServerEvents } from "./types";
import RoleList from "./RoleList";
import back from "./backConnection";
import CreateChannel from "./CreateChannel";
import { io, Socket } from "socket.io-client";
import { Context } from "../MainCompo/SideBars";
import SearchRoom from "./SearchRoom";
import { api_url } from "../../ApiCalls/var";
import { useNavigate } from "react-router";

function Chat() {
  /*
   *   STATES
   */
  const [socket, setSocket] =
    React.useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [channelList, setChannelList] = React.useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = React.useState<Channel>();
  const currentUser = React.useContext(Context).user;
  const navigate = useNavigate();
  /** BACK END CALLS */

  const fetchChannelList = async () => {
    const result = await back.get(`${api_url}/channel/me`).catch((error) => {
      if (error.response.status === 401) navigate("/login");
      alert(error.response.data.message);
      return;
    });
    if (!result) return;
    setChannelList(result.data);
    setCurrentChannel(result.data[0]);
  };

  /*
   *   HOOKS
   */

  React.useEffect(() => {
    fetchChannelList();
  }, []);

  React.useEffect(() => {
    const newSocket = io(`${api_url}/channel`);
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
              socket={socket}
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
              socket={socket}
              currentUser={currentUser}
              currentChannel={currentChannel}
              fetchChannelList={fetchChannelList}
            ></RoleList>
          </Grid>
        </Container>
      </Box>
    );
  else
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
            <Grid item xs={6} md={6} lg={6}>
              <CreateChannel
                fetchChannelList={fetchChannelList}
              ></CreateChannel>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <SearchRoom
                socket={socket}
                channelList={channelList}
                fetchChannelListUser={fetchChannelList}
              ></SearchRoom>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
}

export default Chat;
