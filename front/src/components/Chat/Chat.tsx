import { Container, Grid, Typography } from "@mui/material";
import { Box, width } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import MessageList from "./MessageList";
import ChannelList from "./ChannelList";
import axios, { Axios } from "axios";
import { Message, Channel, userChannelRole } from "./types";
import RoleList from "./RoleList";
import useFromApi from "../../ApiCalls/useFromApi";

function Chat() {
  /*
   *   REFS
   */

  const myRef = React.useRef<null | HTMLDivElement>(null);

  /*
   *   STATES
   */
  const [channelList, setChannelList] = React.useState<Channel[]>([]);
  const [currentChannel, setcurrentChannel] = React.useState<Channel>();
  const [currentRoomIndex, setCurrentRoomIndex] = React.useState<number>(0);
  const [messageList, setMessageList] = React.useState<Message[]>([]);
  const [roleList, setRoleList] = React.useState<userChannelRole[]>([]);

  /** BACK END CALLS */

  const fetchChannelList = async () => {
    const app = axios.create({ withCredentials: true });
    const result = await app.get("http://127.0.0.1:3001/channel/me");
    setChannelList(result.data);
    setcurrentChannel(result.data[0]);
  };

  const fetchMessages = async () => {
    const app = axios.create({ withCredentials: true });
    const result = await app.get(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/messages`
    );
    setMessageList(result.data);
    console.log(result.data);
  };

  const fetchUsers = async () => {
    const app = axios.create({ withCredentials: true });
    const result = await app.get(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/users`
    );
    console.log(result.data);

    setRoleList(result.data);
  };

  /*
   *   HOOKS
   */

  React.useEffect(() => {
    fetchChannelList();
  }, []);

  React.useEffect(() => {
    if (currentChannel) {
      fetchMessages();
      fetchUsers();
    }
  }, [currentChannel]);

  React.useEffect(() => {
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messageList]);

  /*
   *   FUNCTIONS
   */

  function postMessage(message: Message) {
    if (currentChannel) {
      channelList[currentChannel.id].messages = [...messageList, message];
      setMessageList([...messageList, message]);
    }
  }

  function changeRoom(index: number) {
    setCurrentRoomIndex(index);
    setcurrentChannel(channelList[index]);
  }
  /*
   *   RENDER
   */
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
            currentIndex={currentRoomIndex}
            changeRoom={changeRoom}
            channelList={channelList}
          ></ChannelList>
          <MessageList
            innerref={myRef}
            messageList={messageList}
            submit={postMessage}
          />
          <RoleList roleList={roleList}></RoleList>
        </Grid>
      </Container>
    </Box>
  );
}

export default Chat;
