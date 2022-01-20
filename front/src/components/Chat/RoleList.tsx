import { Button, Typography, Grid, Modal, Box, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { RoleListProps, ThemeOptions } from "./types";
import * as React from "react";
import AddUser from "./AddUser";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const useStyle = makeStyles((theme: ThemeOptions) => ({
  RoleListContainer: () => ({
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
  name: () => ({
    marginBottom: "5px",
    marginTop: "5px",
    width: "100%",
  }),
  button: () => ({
    margin: "0 auto",
    display: "block",
  }),
}));

function RoleList({ roleList, fetchUsers, currentChannel }: RoleListProps) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState<string>("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const classes = useStyle();
  function handleClick(event: React.MouseEvent) {}
  return (
    <Grid item xs={12} md={4} lg={3} className={classes.RoleListContainer}>
      {roleList.map((user, index) => {
        return (
          <Button key={index} onClick={handleClick} className={classes.elem}>
            {user.user.id_pseudo}
          </Button>
        );
      })}
      <AddUser
        fetchUsers={fetchUsers}
        currentChannel={currentChannel}
      ></AddUser>
    </Grid>
  );
}
export default RoleList;
