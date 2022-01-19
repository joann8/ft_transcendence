import { Send } from "@mui/icons-material";
import { Button, Grid, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import LoginMask from "./LoginMask";
import * as CSS from "csstype";

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#ffffff",
  border: "3px solid #C6B0A6",
  p: 6,
  margin: "1em",
  justifyContent: "center",
  padding: "1.5rem",
};

const butonStyle = {
  padding: "0.5rem",
  display: "block",
  margin: "auto",
};

export default function Login() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);

  const handleSubmit = (e) => {
    // POST -> BACK
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction={"column"}
      marginTop={29}
      position={"relative"}
    >
      <LoginMask />
      <Grid item>
        <Button
          variant="contained"
          href="http://127.0.0.1:3001/login/42"
          size="large"
          endIcon={<Send />}
        >
          Login with 42
        </Button>
      </Grid>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle} textAlign="center">
          <TextField
            className="twofa-text-field"
            onChange={(e) => setTitle(e.target.value)}
            label="Please enter your 2FA code"
            variant="outlined"
            color="primary"
            fullWidth
            required
            error={titleError}
          />
          <div style={butonStyle}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              endIcon={<Send />}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </Grid>
  );
}
