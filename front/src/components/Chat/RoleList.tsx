import {
  Button,
  Grid,
  MenuItem,
  Menu,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
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
  const [openManageRoom, setOpenManageRoom] = React.useState(false);
  const [openMuteTime, setOpenMuteTime] = React.useState(false);
  const [publicSelectionned, setPublicSelectionned] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [muteTime, setMuteTime] = React.useState("");

  const open = Boolean(anchorEl);

  let bol = true;

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
  const handleNavigateProfile = () => {
    if (!targetRole) return;
    navigate(`/profile/${targetRole.user.id_pseudo}`);
  };
  const fetchPostMute = async () => {
    let minutes = Math.ceil(+muteTime);
    if (!targetRole || !muteTime) return;
    if (isNaN(minutes)) {
      if (bol) {
        alert("not a number");
        setMuteTime("");
      }
      return;
    } else {
      if (minutes <= 0 || minutes > 60) {
        if (bol) {
          alert("between 0 and 60");
          setMuteTime("");
        }
        return;
      }
    }
    await back
      .put(
        `${api_url}/channel/${currentChannel.id}/mute/${targetRole.user.id_pseudo}/${minutes}`
      )
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        return;
      });
    socket.emit("reload", currentChannel);
    if (bol) {
      setTimeout(() => {
        socket.emit("reload", currentChannel);
      }, minutes * 60100);
      fetchUsers();
      setMuteTime("");
    }
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
  const fetchUpdateChannel = async () => {
    if (!currentChannel) return;
    await back
      .post(`${api_url}/channel/${currentChannel.id}/update`, {
        mode: publicSelectionned ? channelType.PUBLIC : channelType.PRIVATE,
        password: publicSelectionned ? null : newPassword,
      })
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        return;
      });
    setNewPassword("");
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
    if (bol) setRoleList(result.data);
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
    else if (bol) setCurrentRole(result.data as userChannelRole);
  };
  React.useEffect(() => {
    if (currentChannel) {
      fetchUsers();
      fetchCurrentRole();
    }
    return () => {
      bol = false;
    };
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
      bol = false;
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
            Reset as a user
          </MenuItem>
        )}
        {((currentRole?.role === channelRole.owner &&
          targetRole?.role !== channelRole.owner) ||
          (currentRole?.role === channelRole.admin &&
            targetRole?.role !== channelRole.owner)) && (
          <MenuItem
            onClick={() => {
              setOpenMuteTime(true);
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
        {<MenuItem onClick={handleNavigateProfile}>go to profile</MenuItem>}
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
      {currentChannel.mode !== channelType.DIRECT &&
        currentRole?.role === channelRole.owner && (
          <>
            <Button
              variant="contained"
              onClick={() => setOpenManageRoom(true)}
              className={classes.elem2}
            >
              MANAGE ROOM
            </Button>
            <Modal
              open={openManageRoom}
              onClose={() => {
                setOpenManageRoom(false);
                setPublicSelectionned(true);
                setNewPassword("");
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  align="center"
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                >
                  SELECT TYPE OF CHANNEL
                </Typography>
                {publicSelectionned ? (
                  <Button variant="contained">PUBLIC</Button>
                ) : (
                  <Button
                    onClick={() => {
                      setPublicSelectionned(true);
                      setNewPassword("");
                    }}
                  >
                    PUBLIC
                  </Button>
                )}
                {publicSelectionned ? (
                  <Button onClick={() => setPublicSelectionned(false)}>
                    PRIVATE
                  </Button>
                ) : (
                  <>
                    <Button variant="contained">PRIVATE</Button>
                    <TextField
                      className={classes.name}
                      id="outlined-basic"
                      label="new password"
                      variant="outlined"
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPassword(e.currentTarget.value)
                      }
                    />
                  </>
                )}
                <Button
                  className={classes.button}
                  variant="contained"
                  onClick={() => {
                    fetchUpdateChannel();
                    setOpenManageRoom(false);
                  }}
                >
                  APPLY CHANGES
                </Button>
              </Box>
            </Modal>
          </>
        )}
      <Modal
        open={openMuteTime}
        onClose={() => {
          setOpenMuteTime(false);
          setMuteTime("");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            align="center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            SELECT NUMBER OF MINUTES TO MUTE (BETWEEN 0 AND 60)
          </Typography>
          <TextField
            className={classes.name}
            id="outlined-basic"
            label="minutes of mute"
            variant="outlined"
            value={muteTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMuteTime(e.currentTarget.value)
            }
          />

          <Button
            className={classes.button}
            variant="contained"
            onClick={() => {
              fetchPostMute();
              setOpenMuteTime(false);
            }}
          >
            MUTE
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
}
export default RoleList;
