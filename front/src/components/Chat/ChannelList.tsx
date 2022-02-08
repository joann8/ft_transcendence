import {
  Button,
  Typography,
  Grid,
  Container,
  Modal,
  TextField,
  ButtonGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import * as React from "react";
import back from "./backConnection";
import CreateChannel from "./CreateChannel";
import SearchRoom from "./SearchRoom";
import { User, ChannelListProps, ThemeOptions, Channel } from "./types";
import ClearIcon from "@mui/icons-material/Clear";
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
}: ChannelListProps) {
  const classes = useStyle();
  async function fetchDeleteRoom(channel: Channel) {
    const result = await back
      .delete(`http://127.0.0.1:3001/channel/${channel.id}`)
      .catch((error) => alert(error.response.data.message));
    console.log("back delete completed");
  }
  function handleClick(event: React.MouseEvent) {
    const element = event.currentTarget as HTMLInputElement;
    const id = +element.getAttribute("data-index");
    if (id && currentChannel.id !== id) {
      const channel = channelList.find((channel) => channel.id === id);
      console.log("change channel");
      changeChannel(channel);
    }
  }
  function handleDelete(event: React.MouseEvent) {
    console.log("handle delete");

    const element = event.currentTarget as HTMLInputElement;
    const id = +element.getAttribute("data-index");
    if (id) {
      const channel = channelList.find((channel) => channel.id === id);
      fetchDeleteRoom(channel).then(() => fetchChannelList());
    }
  }
  return (
    <Grid item xs={12} md={4} lg={3} className={classes.channelListContainer}>
      {channelList.map((room, index) => {
        const ownerRole = room.roles.find((role) => role.role === "owner");
        const ownerUser = ownerRole.user;
        if (ownerUser.id === currentUser.id) {
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
      <SearchRoom></SearchRoom>
    </Grid>
  );
}

export default ChannelList;
