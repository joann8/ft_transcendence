import { Container, Grid, Typography } from "@mui/material";
import { Box, width } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import CurrentChat from "./CurrentChat";
import ChatRooms from "./ChatRooms";
import { makeStyles } from "@mui/styles";
import { Message } from "./types";
import ChatUsers from "./ChatUsers";

let chatRooms = [
  {
    id: 0,
    name: "chatroom1",
    users: ["Joann", "Thib"],
    messageList: [
      {
        user: "Joann",
        content: "message de joann",
        hour: "22h31",
      },
      {
        user: "Thib",
        content: "message de thib",
        hour: "22h31",
      },
    ],
  },
  {
    id: 1,
    name: "chatroom2",
    users: ["Adrien", "Tom"],
    messageList: [
      {
        user: "Adrien",
        content: "message de Adrien",
        hour: "22h31",
      },
      {
        user: "Tom",
        content: "message de Tom",
        hour: "22h31",
      },
    ],
  },
];

function Chat() {
  const myRef = React.useRef<null | HTMLDivElement>(null);
  const [chatRoom, setChatRoom] = React.useState(chatRooms[0]);
  const [currentRoomIndex, setCurrentRoomIndex] = React.useState(0);
  const [messageList, setMessageList] = React.useState<Message[]>(
    chatRooms[0].messageList
  );
  const [userList, setUserList] = React.useState(chatRooms[0].users);
  function postMessage(message: Message) {
    chatRooms[chatRoom.id].messageList = [...messageList, message];
    setMessageList([...messageList, message]);
  }
  function changeRoom(index: number) {
    setCurrentRoomIndex(index);
    setChatRoom(chatRooms[index]);
  }
  React.useEffect(() => {
    setMessageList(chatRoom.messageList);
    setUserList(chatRoom.users);
  }, [chatRoom]);
  React.useEffect(() => {
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messageList]);
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
