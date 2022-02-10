import {
  Button,
  Typography,
  Grid,
  Container,
  Modal,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import * as React from "react";
import back from "./backConnection";
import { CreateChannelProps, ThemeOptions, channelType } from "./types";

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

function CreateChannel({ fetchChannelList }: CreateChannelProps) {
  const [open, setOpenCreate] = React.useState(false);
  const [roomName, setRoomName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [publicMode, setPublic] = React.useState(true);
  const [privateMode, setPrivate] = React.useState(false);

  const classes = useStyle();
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);
  const fetchPostChannel = async () => {
    const result = await back
      .post(`http://127.0.0.1:3001/channel`, {
        name: roomName,
        mode: publicMode ? channelType.PUBLIC : channelType.PRIVATE,
        password: password ? password : null,
      })
      .catch((error) => alert(error.response.data.message));
    fetchChannelList();
    setOpenCreate(false);
  };
  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenCreate}
        className={classes.elem}
      >
        CREATE ROOM
      </Button>
      <Modal
        open={open}
        onClose={handleCloseCreate}
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
            CREATE A CHANNEL ROOM
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={publicMode}
                  onChange={() => {
                    if (publicMode === true) return;
                    setPublic(true);
                    setPrivate(false);
                  }}
                />
              }
              label="public"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={privateMode}
                  onChange={() => {
                    if (privateMode === true) return;
                    setPublic(false);
                    setPrivate(true);
                  }}
                />
              }
              label="private"
            />
          </FormGroup>
          <TextField
            className={classes.name}
            id="outlined-basic"
            label="Room name"
            variant="outlined"
            value={roomName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRoomName(e.currentTarget.value)
            }
          />
          {privateMode && (
            <TextField
              className={classes.name}
              id="outlined-basic"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.currentTarget.value)
              }
            />
          )}
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => {
              if (
                (publicMode && roomName) ||
                (privateMode && roomName && password)
              ) {
                fetchPostChannel();
                setRoomName("");
                setPassword("");
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

export default CreateChannel;
