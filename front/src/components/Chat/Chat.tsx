import { Container, Grid, Typography } from "@mui/material";
import { Box, width } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import CurrentChat from "./CurrentChat";
import ChatRooms from "./ChatRooms";
import axios, { Axios } from "axios";
import { Message, chatRoom } from "./types";
import ChatUsers from "./ChatUsers";
import useFromApi from "../../ApiCalls/useFromApi";

function Chat() {
  /*
   *   REFS
   */

  const myRef = React.useRef<null | HTMLDivElement>(null);

  /*
   *   STATES
   */
  const [chatRooms, setChatRooms] = React.useState<chatRoom[]>([]);
  const [chatRoom, setChatRoom] = React.useState<chatRoom>();
  const [currentRoomIndex, setCurrentRoomIndex] = React.useState(0);
  const [messageList, setMessageList] = React.useState<Message[]>([]);
  const [userList, setUserList] = React.useState<any[]>([]);

  /** BACK END CALLS */

  const fetchChatrooms = async () => {
    const app = axios.create({ withCredentials: true });
    const result = await app.get("http://127.0.0.1:3001/channel/me");
    setChatRooms(result.data);
    setChatRoom(result.data[0]);
  };

  const fetchMessages = async () => {
    const app = axios.create({ withCredentials: true });
    const result = await app.get(
      `http://127.0.0.1:3001/channel/${chatRoom.id}/messages`
    );
    setMessageList(result.data);
    console.log(result.data);
  };

  const fetchUsers = async () => {
    const app = axios.create({ withCredentials: true });
    const result = await app.get(
      `http://127.0.0.1:3001/channel/${chatRoom.id}/users`
    );
    console.log(result.data);

    setUserList(result.data);
  };

  /*
   *   HOOKS
   */

  React.useEffect(() => {
    fetchChatrooms();
  }, []);

  React.useEffect(() => {
    if (chatRoom) {
      fetchMessages();
      fetchUsers();
    }
  }, [chatRoom]);

  React.useEffect(() => {
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messageList]);

  /*
   *   FUNCTIONS
   */

  function postMessage(message: Message) {
    if (chatRoom) {
      chatRooms[chatRoom.id].messageList = [...messageList, message];
      setMessageList([...messageList, message]);
    }
  }

  function changeRoom(index: number) {
    setCurrentRoomIndex(index);
    setChatRoom(chatRooms[index]);
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
          <ChatRooms
            currentIndex={currentRoomIndex}
            changeRoom={changeRoom}
            chatRooms={chatRooms}
          ></ChatRooms>
          <CurrentChat
            innerref={myRef}
            messageList={messageList}
            submit={postMessage}
          />
          <ChatUsers userList={userList}></ChatUsers>
        </Grid>
      </Container>
    </Box>
  );
}

export default Chat;
