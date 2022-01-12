import { Container, Typography, Avatar, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MessagesProps, MessageProps, ThemeOptions } from "./types";

const useStyle = makeStyles((theme: ThemeOptions) => ({
  messagesContainer: () => ({
    margin: "0",
    padding: "5px",
    width: "100%",
    height: "500px",
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

function Message({ message }: MessageProps) {
  const classes = useStyle();
  return (
    <Grid
      container
      columnSpacing={3}
      rowSpacing={0}
      className={classes.message}
      //justifyContent="flex-end"
    >
      <Grid item xs={12} md={12} lg={12}>
        <Typography component="p" align="center" variant="caption">
          {message.hour}
        </Typography>
      </Grid>
      {message.user !== "Thib" ? (
        <Grid item xs={1} md={3} lg={1}>
          <Avatar>{message.user[0]}</Avatar>
        </Grid>
      ) : (
        <div></div>
      )}
      <Grid item xs={11} md={9} lg={11}>
        {message.user === "Thib" ? (
          <Container className={classes.typo}>
            <Typography
              component="div"
              color="white"
              className={classes.messageContentRight}
            >{`${message.content}`}</Typography>
          </Container>
        ) : (
          <Container className={classes.typo}>
            <Typography variant="subtitle1">{message.user}</Typography>
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
function Messages({ messageList, innerref }: MessagesProps) {
  const classes = useStyle();

  return (
    <Container className={classes.messagesContainer}>
      {messageList.map((elem, key) => (
        <Message key={key} message={elem}></Message>
      ))}
      <div ref={innerref}></div>
    </Container>
  );
}

export default Messages;
