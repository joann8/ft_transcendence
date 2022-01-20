import { Button, Typography, Grid, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import { ChannelListProps, ThemeOptions } from "./types";

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
}));

function ChannelList({
  currentIndex,
  changeRoom,
  channelList,
}: ChannelListProps) {
  const classes = useStyle();
  function handleClick(event: React.MouseEvent) {
    const element = event.currentTarget as HTMLInputElement;
    const index = element.getAttribute("data-index");
    if (index) changeRoom(+index);
  }
  return (
    <Grid item xs={12} md={4} lg={3} className={classes.channelListContainer}>
      {channelList.map((room, index) => {
        if (index !== currentIndex) {
          return (
            <Button
              key={index}
              data-index={index}
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
      <Button variant="contained" className={classes.elem}>
        CREATE ROOM
      </Button>
    </Grid>
  );
}

export default ChannelList;
