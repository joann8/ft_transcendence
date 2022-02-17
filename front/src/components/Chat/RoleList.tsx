import { Button, Grid, MenuItem, Menu } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  channelRole,
  channelType,
  RoleListProps,
  ThemeOptions,
  User,
  userChannelRole,
} from "./types";
import * as React from "react";
import AddUser from "./AddUser";
import GroupIcon from "@mui/icons-material/Group";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import BlockIcon from "@mui/icons-material/Block";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router";
import back from "./backConnection";
import { api_url } from "../../ApiCalls/var";

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
  elem2: () => ({
    width: "100%",
    margin: "0",
    padding: "0",
  }),
}));

function RoleList({
  currentChannel,
  currentUser,
  socket,
  fetchChannelList,
}: RoleListProps) {
  const navigate = useNavigate();
  const [roleList, setRoleList] = React.useState<userChannelRole[]>([]);
  const [currentRole, setCurrentRole] = React.useState<userChannelRole>();
  const [targetRole, setTargetRole] = React.useState<userChannelRole>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onClickDefy = (challenger: User, challengee: User) => {
    if (challenger.status === "IN GAME") alert("Your are already in a game");
    else if (challengee.status === "IN GAME")
      alert(`${challengee.id_pseudo} is busy playing`);
    else if (challengee.status === "IN QUEUE")
      alert(`${challengee.id_pseudo} is already waiting for another player`);
    else if (challengee.status === "OFFLINE")
      alert(`${challengee.id_pseudo} is not connected`);
    else navigate(`/game/challenge/${challengee.id_pseudo}`);
  };

  const onClickWatch = (watcher: User, watchee: User) => {
    if (watchee.status === "ONLINE" || watchee.status === "IN QUEUE")
      alert(`${watchee.id_pseudo} is not in a game at the moment`);
    else if (watchee.status === "OFFLINE")
      alert(`${watchee.id_pseudo} is not connected`);
    else navigate(`/game/watch/${watchee.id_pseudo}`);
  };

  const handleDuel = () => {
    onClickDefy(currentUser, targetRole.user);
  };
  const handleWatch = () => {
    onClickWatch(currentUser, targetRole.user);
  };
  const fetchPostAction = async (action: string) => {
    if (!targetRole) return;
    await back
      .put(
        `${api_url}/channel/${currentChannel.id}/${action}/${targetRole.user.id_pseudo}`
      )
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        return;
      });
    socket.emit("reload", currentChannel);
    fetchUsers();
  };

  const fetchLeaveChannel = async () => {
    await back
      .get(`${api_url}/channel/leave/${currentChannel.id}`)
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        return;
      });
    socket.emit("reload", currentChannel);
    fetchChannelList();
  };
  const handleClickLeave = () => {
    fetchLeaveChannel();
  };
  const fetchUsers = async () => {
    let error = false;
    const result = await back
      .get(`${api_url}/channel/${currentChannel.id}/users`)
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        error = true;
        return;
      });
    if (!result || error) return;
    setRoleList(result.data);
  };
  const fetchCurrentRole = async () => {
    const result = await back
      .get(`${api_url}/channel/${currentChannel.id}/role/me`)
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        return;
      });
    if (!result) return;
    if (!result || !result.data || result.data.role === "banned")
      fetchChannelList();
    else setCurrentRole(result.data as userChannelRole);
  };
  React.useEffect(() => {
    if (currentChannel) {
      fetchUsers();
      fetchCurrentRole();
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

  React.useEffect(() => {
    const reloadListener = () => {
      fetchCurrentRole();
      fetchUsers();
    };
    socket.on("reload", reloadListener);
    return () => {
      socket.off("reload", reloadListener);
    };
  }, [currentChannel]);

  const classes = useStyle();
  return (
    <Grid item xs={3} md={3} lg={3} className={classes.RoleListContainer}>
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
        {currentRole?.role === channelRole.owner &&
          targetRole?.role !== channelRole.owner && (
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
        {((currentRole?.role === channelRole.owner &&
          targetRole?.role !== channelRole.owner) ||
          (currentRole?.role === channelRole.admin &&
            targetRole?.role !== channelRole.owner)) && (
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
        {((currentRole?.role === channelRole.owner &&
          targetRole?.role !== channelRole.owner) ||
          (currentRole?.role === channelRole.admin &&
            targetRole?.role !== channelRole.owner)) && (
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
        {((currentRole?.role === channelRole.owner &&
          targetRole?.role !== channelRole.owner) ||
          (currentRole?.role === channelRole.admin &&
            targetRole?.role !== channelRole.owner)) && (
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
        {((currentRole?.role === channelRole.owner &&
          targetRole?.role !== channelRole.owner) ||
          (currentRole?.role === channelRole.admin &&
            targetRole?.role !== channelRole.owner)) && (
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
        {<MenuItem onClick={handleDuel}>Duel</MenuItem>}
        {<MenuItem onClick={handleWatch}>Watch</MenuItem>}
      </Menu>
      {currentChannel.mode !== channelType.DIRECT && (
        <AddUser
          fetchUsers={fetchUsers}
          currentChannel={currentChannel}
          socket={socket}
        ></AddUser>
      )}

      {currentChannel.mode !== channelType.DIRECT &&
        currentRole?.role !== channelRole.owner && (
          <Button
            variant="contained"
            onClick={handleClickLeave}
            className={classes.elem2}
          >
            LEAVE
          </Button>
        )}
    </Grid>
  );
}
export default RoleList;
