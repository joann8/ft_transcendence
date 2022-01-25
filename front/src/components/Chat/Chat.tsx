import { Container, Grid } from "@mui/material";
import { Box } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import MessageList from "./MessageList";
import ChannelList from "./ChannelList";
import { Message, Channel, userChannelRole, User } from "./types";
import RoleList from "./RoleList";
import back from "./backConnection";
import CreateChannel from "./CreateChannel";

function Chat() {
  /*
   *   REFS
   */

  const myRef = React.useRef<null | HTMLDivElement>(null);

  /*
   *   STATES
   */
  const [channelList, setChannelList] = React.useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = React.useState<Channel>();
  const [messageList, setMessageList] = React.useState<Message[]>([]);
  const [roleList, setRoleList] = React.useState<userChannelRole[]>([]);
  const [currentUser, setCurrentUser] = React.useState<User>();

  /** BACK END CALLS */

  const fetchChannelList = async () => {
    const result = await back.get("http://127.0.0.1:3001/channel/me");
    console.log("fetch channel list ok");
    setChannelList(result.data);
    setCurrentChannel(result.data[0]);
  };

  const fetchMessages = async () => {
    const result = await back.get(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/messages`
    );
    console.log("fetch messages ok");

    setMessageList(result.data);
  };

  async function fetchCurrentUser() {
    const result = await back.get("http://127.0.0.1:3001/user");
    setCurrentUser(result.data);
  }

  const fetchUsers = async () => {
    const result = await back.get(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/users`
    );
    console.log("fetch users ok");

    setRoleList(result.data);
  };

  const fetchPostMessage = async (content: string) => {
    const result = await back.post(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/messages`,
      {
        content: content,
      }
    );
  };

  /*
   *   HOOKS
   */

  React.useEffect(() => {
    fetchCurrentUser();
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
              fetchChannelList={fetchChannelList}
            ></ChannelList>
            <MessageList
              innerref={myRef}
              messageList={messageList}
              submit={postMessage}
            ></MessageList>

            <RoleList
              currentUser={currentUser}
              roleList={roleList}
              fetchUsers={fetchUsers}
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
