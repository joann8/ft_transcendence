import { Container, Grid, Typography } from "@mui/material";
import { Box, width } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import CurrentChat from "./CurrentChat";
import ChatRooms from "./ChatRooms";
import axios from "axios";
import { Message, chatRoom } from "./types";
import ChatUsers from "./ChatUsers";

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
  const [userList, setUserList] = React.useState<string[]>([]);

  /*
   *   HOOKS
   */

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:3001/chat");
      setChatRooms(result.data);
      setChatRoom(result.data[0]);
      setMessageList(result.data[0].messageList);
      setUserList(result.data[0].users);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (chatRoom) {
      setMessageList(chatRoom.messageList);
      setUserList(chatRoom.users);
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
