import { Button, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ChatUsersProps, ThemeOptions } from "./types";

const useStyle = makeStyles((theme: ThemeOptions) => ({
  ChatUsersContainer: () => ({
    margin: "0",
    padding: "0",
    width: "100%",
    height: "600px",
    backgroundColor: "white",
    borderRadius: "10px",
    overflowY: "hidden",
    overflowX: "hidden",
    paddingRight: "10px",
  }),
  elem: () => ({
    width: "100%",
    margin: "0",
    padding: "0",
  }),
}));

function ChatUsers({ userList }: ChatUsersProps) {
  const classes = useStyle();
  function handleClick(event: React.MouseEvent) {}
  return (
    <Grid item xs={12} md={4} lg={3} className={classes.ChatUsersContainer}>
      {userList.map((user, index) => {
        return (
          <Button key={index} onClick={handleClick} className={classes.elem}>
            {user}
          </Button>
        );
      })}
      <Button variant="contained" className={classes.elem}>
        ADD USER
      </Button>
    </Grid>
  );
}
export default ChatUsers;
