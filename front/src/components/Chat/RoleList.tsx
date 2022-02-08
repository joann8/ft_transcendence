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
import { RoleListProps, ThemeOptions, User, userChannelRole } from "./types";
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
    height: "80vh",
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

function RoleList({ currentChannel, currentUser }: RoleListProps) {
  const [roleList, setRoleList] = React.useState<userChannelRole[]>([]);
  const [targetRole, setTargetRole] = React.useState<userChannelRole>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const fetchPostAction = async (action: string) => {
    console.log(targetRole);
    if (!targetRole) return;
    const result = await back
      .put(
        `http://127.0.0.1:3001/channel/${currentChannel.id}/${action}/${targetRole.user.id_pseudo}`
      )
      .catch((error) => alert(error.response.data.message));
    fetchUsers();
  };
  const fetchUsers = async () => {
    const result = await back.get(
      `http://127.0.0.1:3001/channel/${currentChannel.id}/users`
    );
    console.log("fetch users ok");
    setRoleList(result.data);
  };
  React.useEffect(() => {
    if (currentChannel) {
      fetchUsers();
    }
  }, [currentChannel]);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const element = event.currentTarget as HTMLInputElement;
    const id = +element.getAttribute("data-index");
    setTargetRole(roleList.find((elem) => id === elem.user.id));
    if (id === currentUser.id) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const classes = useStyle();
  return (
    <Grid item xs={12} md={4} lg={3} className={classes.RoleListContainer}>
      {roleList.map((role, index) => {
        if (role.role === "owner")
          return (
            <Button
              startIcon={<AdminPanelSettingsIcon />}
              key={index}
              data-index={role.user.id}
              onClick={handleClick}
              className={classes.elem}
            >
              {role.user.id_pseudo}
            </Button>
          );
        if (role.role === "admin")
          return (
            <Button
              startIcon={<SupervisedUserCircleIcon />}
              key={index}
              data-index={role.user.id}
              onClick={handleClick}
              className={classes.elem}
            >
              {role.user.id_pseudo}
            </Button>
          );
        if (role.role === "user")
          return (
            <Button
              startIcon={<GroupIcon />}
              key={index}
              onClick={handleClick}
              data-index={role.user.id}
              className={classes.elem}
            >
              {role.user.id_pseudo}
            </Button>
          );
        if (role.role === "muted")
          return (
            <Button
              startIcon={<VolumeOffIcon />}
              key={index}
              onClick={handleClick}
              data-index={role.user.id}
              className={classes.elem}
            >
              {role.user.id_pseudo}
            </Button>
          );
        if (role.role === "banned")
          return (
            <Button
              startIcon={<BlockIcon />}
              key={index}
              data-index={role.user.id}
              onClick={handleClick}
              className={classes.elem}
            >
              {role.user.id_pseudo}
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
          <MenuItem
            onClick={() => {
              fetchPostAction("admin");
              handleClose();
              return;
            }}
          >
            Set Admin
          </MenuItem>
        )}
        {currentUser?.role === "owner" && (
          <MenuItem
            onClick={() => {
              fetchPostAction("reset-as-user");
              handleClose();
              return;
            }}
          >
            Reset User
          </MenuItem>
        )}
        {(currentUser?.role === "owner" || currentUser?.role === "admin") && (
          <MenuItem
            onClick={() => {
              fetchPostAction("mute");
              handleClose();
              return;
            }}
          >
            Mute
          </MenuItem>
        )}
        {(currentUser?.role === "owner" || currentUser?.role === "admin") && (
          <MenuItem
            onClick={() => {
              fetchPostAction("bann");
              handleClose();
              return;
            }}
          >
            Bann
          </MenuItem>
        )}
        {(currentUser?.role === "owner" || currentUser?.role === "admin") && (
          <MenuItem
            onClick={() => {
              fetchPostAction("kick");
              handleClose();
              return;
            }}
          >
            Kick
          </MenuItem>
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
