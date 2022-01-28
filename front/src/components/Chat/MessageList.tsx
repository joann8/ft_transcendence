import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import * as React from "react";
import back from "./backConnection";

import Messages from "./Messages";
import PostMessage from "./PostMessage";
import { MessageListProps, Message, Channel } from "./types";

const useStyle = makeStyles({});
function MessageList({
  socket,
  currentChannel,
  currentUser,
}: MessageListProps) {
  const myRef = React.useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const fetchMessages = async () => {
    const result = await back.get(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/messages`
    );
    setMessages(result.data);
  };

  useEffect(() => {
    fetchMessages();
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [currentChannel]);

  useEffect(() => {
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  function postMessage(content: string) {
    socket.emit("message", currentUser, currentChannel, content);
  }

  useEffect(() => {
    const messageListener = (channel, message) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages;
      });
    };

    socket.on("message", messageListener);
    return () => {
      socket.off("message", messageListener);
    };
  }, [socket]);

  return (
    <Grid item xs={12} md={4} lg={6}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Messages innerref={myRef} messageList={messages}></Messages>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <PostMessage submit={postMessage}></PostMessage>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MessageList;
