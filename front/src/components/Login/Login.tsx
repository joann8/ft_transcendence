import { Send } from "@mui/icons-material";
import { Button, Grid, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import LoginMask from "./LoginMask";
import * as CSS from "csstype";
import { useNavigate } from "react-router";

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

export default function Login(props) {
  const [open, setOpen] = useState(props.twofa);
  const [secret, setSecret] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [helperError, setHelperError] = useState("");
  const [isPending, setIsPending] = useState(false);
  let nav = useNavigate();

  const handleClose = () => {
    setOpen(false);
    nav("/login");
  };

  const handleSubmit = async () => {
    setIsPending(true);
    fetch("http://127.0.0.1:3001/2fa/authenticate", {
      method: "PUT",
      credentials: "include",
      referrerPolicy: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: secret }),
    }).then((res) => {
      setIsPending(false);
      if (!res.ok) {
        setTitleError(true);
        res.json().then((data) => {
          setHelperError(data.message);
        });
      } else {
        setOpen(false);
        nav("/");
      }
    });
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle} textAlign="center">
          <TextField
            className="twofa-text-field"
            onChange={(e) => setSecret(e.target.value)}
            label="Please enter your 2FA code"
            variant="outlined"
            color="primary"
            fullWidth
            required
            error={titleError}
            helperText={helperError}
          />
          <div style={butonStyle}>
            {!isPending && (
              <Button
                type="submit"
                color="primary"
                variant="contained"
                endIcon={<Send />}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
            {isPending && (
              <Button disabled color="primary">
                Submiting...
              </Button>
            )}
          </div>
        </Box>
      </Modal>
    </Grid>
  );
}
