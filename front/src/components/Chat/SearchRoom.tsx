import { Button, Typography, Modal, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import * as React from "react";
import back from "./backConnection";
import { Channel, channelType, ThemeOptions } from "./types";
import { api_url } from "../../ApiCalls/var";
import { useNavigate } from "react-router";

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

function SearchRoom({ channelList, fetchChannelListUser, socket }) {
  const navigate = useNavigate();

  const [open, setOpenSearch] = React.useState(false);
  const [currentSearchRoom, setCurrentSearchRoom] = React.useState<Channel>();
  const [content, setContent] = React.useState<string>("");
  const [channelListId, setChannelListId] = React.useState<number[]>();
  const [allChannelList, setAllChannelList] = React.useState<Channel[]>([]);
  const classes = useStyle();

  React.useEffect(() => {
    setChannelListId(channelList.map((elem) => elem.id));
  }, [channelList]);
  React.useEffect(() => {
    setCurrentSearchRoom(allChannelList[0]);
  }, [allChannelList]);
  const fetchChannelList = async () => {
    const result = await back.get(`${api_url}/channel/`).catch((error) => {
      if (error.response.status === 401) navigate("/login");
      alert(error.response.data.message);
      return;
    });
    if (!result) return;
    setAllChannelList(result.data);
  };
  const fetchJoinRoom = async () => {
    const result = await back
      .post(`${api_url}/channel/join/${currentSearchRoom.id}`, {
        mode: currentSearchRoom.mode,
        password: content,
      })
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        setContent("");
        return;
      });
    setOpenSearch(false);

    if (!result) return;
    socket.emit("reload", currentSearchRoom);
    fetchChannelListUser();
  };
  const handleOpenSearch = () => {
    fetchChannelList();
    setOpenSearch(true);
  };
  const handleCloseSearch = () => setOpenSearch(false);
  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenSearch}
        className={classes.elem}
      >
        JOIN ROOM
      </Button>
      <Modal
        open={open}
        onClose={handleCloseSearch}
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
            SELECT A ROOM
          </Typography>
          {currentSearchRoom &&
            allChannelList.map((channel, key) => {
              if (
                channelListId.includes(channel.id) ||
                channel.mode === channelType.DIRECT
              )
                return;
              if (channel.id === currentSearchRoom.id)
                return (
                  <Button key={key} variant="contained">
                    {channel.name}
                  </Button>
                );
              else
                return (
                  <Button
                    key={key}
                    onClick={() => setCurrentSearchRoom(channel)}
                  >
                    {channel.name}
                  </Button>
                );
            })}
          {currentSearchRoom &&
            currentSearchRoom.mode === channelType.PRIVATE && (
              <TextField
                className={classes.name}
                id="outlined-basic"
                label="Room password"
                variant="outlined"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContent(e.currentTarget.value)
                }
              />
            )}

          <Button
            className={classes.button}
            variant="contained"
            onClick={fetchJoinRoom}
          >
            JOIN
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default SearchRoom;
