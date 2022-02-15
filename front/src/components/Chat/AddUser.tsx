import { Button, Typography, Modal, Box, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AddUserProps, ThemeOptions } from "./types";
import * as React from "react";
import back from "./backConnection";
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

const useStyle = makeStyles(() => ({
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

function AddUser({ currentChannel, socket }: AddUserProps) {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState<string>("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const classes = useStyle();
  const fetchPostUser = async (pseudo: string) => {
    const result = await back
      .put(`${api_url}/channel/${currentChannel.id}/add/${pseudo}`)
      .catch((error) => {
        if (error.response.status === 401) navigate("/login");
        alert(error.response.data.message);
        setContent("");
        return;
      });
    socket.emit("reload", currentChannel);
    setOpen(false);
  };
  return (
    <>
      <Button variant="contained" onClick={handleOpen} className={classes.elem}>
        ADD USER
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
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
            ADD A USER
          </Typography>
          <TextField
            className={classes.name}
            id="outlined-basic"
            label="PSEUDO"
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
                fetchPostUser(content);
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
export default AddUser;
