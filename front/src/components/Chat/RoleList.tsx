import {
  Button,
  Typography,
  Grid,
  Modal,
  Box,
  TextField,
  Container,
  MenuItem,
  Menu,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { RoleListProps, ThemeOptions, User } from "./types";
import * as React from "react";
import AddUser from "./AddUser";
import GroupIcon from "@mui/icons-material/Group";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import BlockIcon from "@mui/icons-material/Block";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Group from "@mui/icons-material/Group";
import back from "./backConnection";

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
    color: "black",
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
  titleRoleContainer: () => ({
    margin: "0",
    width: "100%",
    verticalAlign: "middle",
    float: "left",
    display: "inline-block",
    borderBlockColor: theme.palette.primary.main,
    borderTop: "3px solid",
    borderBottom: "3px solid",
  }),
  titleRoleIcon: () => ({
    float: "left",
    verticalAlign: "middle",
    display: "inline-block",
  }),
}));

function RoleList({ roleList, fetchUsers, currentChannel }: RoleListProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = React.useState<User>();
  const open = Boolean(anchorEl);

  async function fetchCurrentUser() {
    const result = await back.get("http://127.0.0.1:3001/user");
    setCurrentUser(result.data);
  }
  React.useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const element = event.currentTarget as HTMLInputElement;
    const id = +element.getAttribute("data-index");
    if (id === currentUser.id) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const classes = useStyle();
  return (
    <Grid item xs={12} md={4} lg={3} className={classes.RoleListContainer}>
      {roleList.map((user, index) => {
        if (user.role === "owner")
          return (
            <Button
              startIcon={<AdminPanelSettingsIcon />}
              key={index}
              data-index={user.user.id}
              onClick={handleClick}
              className={classes.elem}
            >
              {user.user.id_pseudo}
            </Button>
          );
        if (user.role === "admin")
          return (
            <Button
              startIcon={<SupervisedUserCircleIcon />}
              key={index}
              onClick={handleClick}
              className={classes.elem}
            >
              {user.user.id_pseudo}
            </Button>
          );
        if (user.role === "user")
          return (
            <Button
              startIcon={<GroupIcon />}
              key={index}
              onClick={handleClick}
              className={classes.elem}
            >
              {user.user.id_pseudo}
            </Button>
          );
        if (user.role === "muted")
          return (
            <Button
              startIcon={<VolumeOffIcon />}
              key={index}
              onClick={handleClick}
              className={classes.elem}
            >
              {user.user.id_pseudo}
            </Button>
          );
        if (user.role === "banned")
          return (
            <Button
              startIcon={<BlockIcon />}
              key={index}
              onClick={handleClick}
              className={classes.elem}
            >
              {user.user.id_pseudo}
            </Button>
          );
      })}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {currentUser?.role === "owner" && (
          <MenuItem onClick={handleClose}>Set Admin</MenuItem>
        )}
        {(currentUser?.role === "owner" || currentUser?.role === "admin") && (
          <MenuItem onClick={handleClose}>Mute</MenuItem>
        )}
        {(currentUser?.role === "owner" || currentUser?.role === "admin") && (
          <MenuItem onClick={handleClose}>Bann</MenuItem>
        )}
        {<MenuItem onClick={handleClose}>Duel</MenuItem>}
      </Menu>
      <AddUser
        fetchUsers={fetchUsers}
        currentChannel={currentChannel}
      ></AddUser>
    </Grid>
  );
}
export default RoleList;
