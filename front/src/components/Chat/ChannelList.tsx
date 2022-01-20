import {
  Button,
  Typography,
  Grid,
  Container,
  Modal,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import * as React from "react";
import back from "./backConnection";
import CreateChannel from "./CreateChannel";
import SearchRoom from "./SearchRoom";
import { Channel, ChannelListProps, ThemeOptions } from "./types";

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

function ChannelList({
  currentChannel,
  changeChannel,
  channelList,
  fetchChannelList,
}: ChannelListProps) {
  const classes = useStyle();
  function handleClick(event: React.MouseEvent) {
    const element = event.currentTarget as HTMLInputElement;
    const id = element.getAttribute("data-index");
    if (id) {
      const channel = channelList.find((channel) => channel.id === +id);
      changeChannel(channel);
    }
  }
  return (
    <Grid item xs={12} md={4} lg={3} className={classes.channelListContainer}>
      {channelList.map((room, index) => {
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
              data-index={index}
              onClick={handleClick}
              color="secondary"
              className={classes.elem}
            >
              {room.name}
            </Button>
          );
        }
      })}
      <CreateChannel fetchChannelList={fetchChannelList}></CreateChannel>
      <SearchRoom></SearchRoom>
    </Grid>
  );
}

export default ChannelList;
