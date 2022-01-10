import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import Messages from "./Messages";
import PostMessage from "./PostMessage";
import { Message } from "./types";

const useStyle = makeStyles({
  formMessageContainer: {
    height: "130px",
    backgroundColor: "yellow",
  },
});
function CurrentChat() {
  const classes = useStyle();
  const myRef = React.useRef<null | HTMLDivElement>(null);
  const [messageList, setMessageList] = React.useState<Message[]>([
    {
      user: "Joann",
      content: "9h30",
      hour: "22h31",
    },
    {
      user: "Joann",
      content: "@Thib tu confirmes?",
      hour: "22h31",
    },
    {
      user: "Thib",
      content: "Yes je serais là ;)",
      hour: "22h41",
    },
    {
      user: "Thib",
      content: "Je pars de chez moi",
      hour: "9h30",
    },
  ]);
  function postMessage(message: Message) {
    setMessageList([...messageList, message]);
  }
  React.useEffect(() => {
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messageList]);

  return (
    <Grid item xs={12} md={4} lg={6}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Messages innerref={myRef} messageList={messageList}></Messages>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <PostMessage submit={postMessage}></PostMessage>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CurrentChat;
