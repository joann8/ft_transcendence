import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import * as React from "react";
import back from "./backConnection";
import { api_url } from "../../ApiCalls/var";
import { useNavigate } from "react-router";
import Messages from "./Messages";
import PostMessage from "./PostMessage";
import { MessageListProps, Message } from "./types";

const useStyle = makeStyles({});
function MessageList({
  socket,
  currentChannel,
  currentUser,
}: MessageListProps) {
  const navigate = useNavigate();

  const myRef = React.useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [blockedList, setBlockedList] = React.useState<number[]>([]);

  const fetchBlockedList = async () => {
    const result = await back
      .get(`${api_url}/relation/blocked`)
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        return;
      });
    if (!result) return;
    setBlockedList(result.data);
  };

  const fetchMessages = async () => {
    const result = await back
      .get(`${api_url}/channel/${currentChannel.id}/messages`)
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        return;
      });
    if (!result) return;
    setMessages(result.data);
  };

  useEffect(() => {
    fetchMessages();
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    socket.emit("channelConnect", currentChannel);
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
      if (blockedList.includes(message.author.id)) return;
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages;
      });
    };
    const exceptionListener = (exception: string) => {
      alert(exception);
    };
    socket.on("message", messageListener);
    socket.on("exception", exceptionListener);
    return () => {
      socket.off("message", messageListener);
      socket.off("exception", exceptionListener);
    };
  }, [blockedList]);

  useEffect(() => {
    fetchBlockedList();
  }, []);

  return (
    <Grid item xs={12} md={4} lg={6}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Messages
            innerref={myRef}
            messageList={messages}
            currentUser={currentUser}
          ></Messages>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <PostMessage submit={postMessage}></PostMessage>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MessageList;
