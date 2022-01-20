import { Container, Grid } from "@mui/material";
import { Box } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import MessageList from "./MessageList";
import ChannelList from "./ChannelList";
import { Message, Channel, userChannelRole } from "./types";
import RoleList from "./RoleList";
import back from "./backConnection";

function Chat() {
  /*
   *   REFS
   */

  const myRef = React.useRef<null | HTMLDivElement>(null);

  /*
   *   STATES
   */
  const [channelList, setChannelList] = React.useState<Channel[]>([]);
  const [currentChannel, setcurrentChannel] = React.useState<Channel>({
    id: 0,
    name: "",
    messages: [],
    roles: [],
  });
  const [messageList, setMessageList] = React.useState<Message[]>([]);
  const [roleList, setRoleList] = React.useState<userChannelRole[]>([]);

  /** BACK END CALLS */

  const fetchChannelList = async () => {
    const result = await back.get("http://127.0.0.1:3001/channel/me");
    setChannelList(result.data);
  };

  const fetchMessages = async () => {
    const result = await back.get(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/messages`
    );
    console.log(result.data);

    setMessageList(result.data);
  };

  const fetchUsers = async () => {
    const result = await back.get(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/users`
    );
    console.log(result.data);
    setRoleList(result.data);
  };

  const fetchPostMessage = async (content: string) => {
    const result = await back.post(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/messages`,
      {
        content: content,
      }
    );
    console.log(result.data);
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

  function postMessage(content: string) {
    if (currentChannel) {
      fetchPostMessage(content);
    }
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
            currentChannel={currentChannel}
            changeChannel={setcurrentChannel}
            channelList={channelList}
            fetchChannelList={fetchChannelList}
          ></ChannelList>
          <MessageList
            innerref={myRef}
            messageList={messageList}
            submit={postMessage}
          ></MessageList>

          <RoleList
            roleList={roleList}
            fetchUsers={fetchUsers}
            currentChannel={currentChannel}
          ></RoleList>
        </Grid>
      </Container>
    </Box>
  );
}

export default Chat;
