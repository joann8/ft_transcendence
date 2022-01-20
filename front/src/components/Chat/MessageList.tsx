import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Messages from "./Messages";
import PostMessage from "./PostMessage";
import { MessageListProps } from "./types";

const useStyle = makeStyles({
  formMessageContainer: {
    height: "130px",
    backgroundColor: "yellow",
  },
});
function MessageList({ innerref, messageList, submit }: MessageListProps) {
  const classes = useStyle();

  return (
    <Grid item xs={12} md={4} lg={6}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Messages innerref={innerref} messageList={messageList}></Messages>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <PostMessage submit={submit}></PostMessage>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MessageList;
