import { Container, Typography, Avatar, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MessagesProps, MessageProps, ThemeOptions } from "./types";

const useStyle = makeStyles((theme: ThemeOptions) => ({
  messagesContainer: () => ({
    margin: "0",
    padding: "5px",
    width: "100%",
    height: "70vh",
    backgroundColor: "white",
    borderRadius: "10px",
    overflowY: "scroll",
    overflowX: "hidden",
  }),
  message: () => ({
    width: "100%",
  }),
  messageContentRight: () => ({
    marginLeft: "auto",
    marginRight: "0",
    maxWidth: "fit-content",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px",
    paddingLeft: "5px",
    paddingRight: "5px",
  }),
  messageContentLeft: () => ({
    maxWidth: "fit-content",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px",
    paddingLeft: "5px",
    paddingRight: "5px",
  }),
  typo: () => ({
    margin: "0",
    padding: "0",
    width: "100%",
  }),
}));

function Message({ message, currentUser }: MessageProps) {
  function formatDate(date: Date) {
    var theMinutesNow = new Date().getTime() / (1000 * 60);
    var theMinutesMessage = new Date(date).getTime() / (1000 * 60);
    return `${
      Math.ceil(theMinutesNow - theMinutesMessage - 60) < 60
        ? `${Math.ceil(theMinutesNow - theMinutesMessage - 60)} min ago`
        : new Date(date).toLocaleDateString()
    }`;
  }

  const classes = useStyle();
  return (
    <Grid
      container
      columnSpacing={3}
      rowSpacing={0}
      className={classes.message}
    >
      <Grid item xs={12} md={12} lg={12}>
        <Typography component="p" align="center" variant="caption">
          {formatDate(message.date)}
        </Typography>
      </Grid>
      {message.author.id_pseudo !== currentUser.id_pseudo ? (
        <Grid item xs={1} md={3} lg={1}>
          <Avatar src={message.author.avatar}></Avatar>
        </Grid>
      ) : (
        <div></div>
      )}
      <Grid item xs={11} md={9} lg={11}>
        {message.author.id_pseudo === currentUser.id_pseudo ? (
          <Container className={classes.typo}>
            <Typography
              component="div"
              color="white"
              className={classes.messageContentRight}
            >{`${message.content}`}</Typography>
          </Container>
        ) : (
          <Container className={classes.typo}>
            <Typography variant="subtitle1">
              {message.author.id_pseudo}
            </Typography>
            <Typography
              component="div"
              color="white"
              className={classes.messageContentLeft}
            >{`${message.content}`}</Typography>
          </Container>
        )}
      </Grid>
    </Grid>
  );
}
function Messages({ messageList, innerref, currentUser }: MessagesProps) {
  const classes = useStyle();

  return (
    <Container className={classes.messagesContainer}>
      {messageList.map((elem, key) => (
        <Message key={key} message={elem} currentUser={currentUser}></Message>
      ))}
      <div ref={innerref}></div>
    </Container>
  );
}

export default Messages;
