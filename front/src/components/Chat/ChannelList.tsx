import { Button, Grid, ButtonGroup } from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import back from "./backConnection";
import CreateChannel from "./CreateChannel";
import SearchRoom from "./SearchRoom";
import { ChannelListProps, Channel, channelType } from "./types";
import ClearIcon from "@mui/icons-material/Clear";
import { api_url } from "../../ApiCalls/var";
import { useNavigate } from "react-router";

const useStyle = makeStyles(() => ({
  channelListContainer: () => ({
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

function ChannelList({
  currentChannel,
  changeChannel,
  currentUser,
  channelList,
  fetchChannelList,
  socket,
}: ChannelListProps) {
  const classes = useStyle();
  const navigate = useNavigate();

  async function fetchDeleteRoom(channel: Channel) {
    await back.delete(`${api_url}/channel/${channel.id}`).catch((error) => {
      if (error.response.status === 401) navigate("/login");
      alert(error.response.data.message);
      return;
    });
  }
  function handleClick(event: React.MouseEvent) {
    const element = event.currentTarget as HTMLInputElement;
    const id = +element.getAttribute("data-index");
    if (id && currentChannel.id !== id) {
      const channel = channelList.find((channel) => channel.id === id);
      changeChannel(channel);
    }
  }
  function handleDelete(event: React.MouseEvent) {
    const element = event.currentTarget as HTMLInputElement;
    const id = +element.getAttribute("data-index");
    if (id) {
      const channel = channelList.find((channel) => channel.id === id);
      fetchDeleteRoom(channel).then(() => fetchChannelList());
    }
  }
  return (
    <Grid item xs={3} md={3} lg={3} className={classes.channelListContainer}>
      {channelList.map((room, index) => {
        const ownerRole = room.roles.find((role) => role.role === "owner");
        const ownerUser = ownerRole.user;
        if (
          room.mode !== channelType.DIRECT &&
          ownerUser.id === currentUser.id
        ) {
          return (
            <ButtonGroup variant="text" key={index} className={classes.elem}>
              {room.id !== currentChannel.id && (
                <Button
                  style={{ width: "80%", border: "none" }}
                  data-index={room.id}
                  onClick={handleClick}
                >
                  {" "}
                  {room.name}
                </Button>
              )}
              {room.id === currentChannel.id && (
                <Button
                  style={{ width: "80%", border: "none" }}
                  color="secondary"
                  data-index={room.id}
                  onClick={handleClick}
                >
                  {" "}
                  {room.name}
                </Button>
              )}

              <Button
                style={{ width: "20%", border: "none" }}
                startIcon={<ClearIcon></ClearIcon>}
                data-index={room.id}
                onClick={handleDelete}
              ></Button>
            </ButtonGroup>
          );
        } else {
          if (room.id !== currentChannel.id) {
            return (
              <Button
                key={index}
                data-index={room.id}
                onClick={handleClick}
                className={classes.elem}
              >
                {room.name}
              </Button>
            );
          } else {
            return (
              <Button
                key={index}
                data-index={room.id}
                onClick={handleClick}
                color="secondary"
                className={classes.elem}
              >
                {room.name}
              </Button>
            );
          }
        }
      })}
      <CreateChannel fetchChannelList={fetchChannelList}></CreateChannel>
      <SearchRoom
        channelList={channelList}
        fetchChannelListUser={fetchChannelList}
        socket={socket}
      ></SearchRoom>
    </Grid>
  );
}

export default ChannelList;
