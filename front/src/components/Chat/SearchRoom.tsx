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
import { Channel, ThemeOptions } from "./types";

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

function SearchRoom() {
  const [search, setOpenSearch] = React.useState(false);
  const [currentSearchRoom, setCurrentSearchRoom] = React.useState(0);
  const [content, setContent] = React.useState<string>("");
  const [allChannelList, setAllChannelList] = React.useState<Channel[]>([]);
  const classes = useStyle();
  const fetchChannelList = async () => {
    const result = await back
      .get("http://127.0.0.1:3001/channel/")
      .catch((error) => alert(error.response.data.message));
    if (!result) return;
    setAllChannelList(result.data);
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
        open={search}
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
          {allChannelList.map((channel, key) => {
            if (key === currentSearchRoom)
              return (
                <Button key={key} variant="contained">
                  {channel.name}
                </Button>
              );
            else
              return (
                <Button key={key} onClick={() => setCurrentSearchRoom(key)}>
                  {channel.name}
                </Button>
              );
          })}
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
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => {
              if (content) {
                // submit(content);
              }
              return;
            }}
          >
            SUBMIT
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default SearchRoom;
