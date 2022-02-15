import { Send } from "@mui/icons-material";
import { Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { api_url } from "../../ApiCalls/var";
import { Context } from "./SideBars";

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "#ffffff",
  border: "3px solid #C6B0A6",
  p: 6,
  margin: "1em",
  justifyContent: "center",
  padding: "1.5rem",
};

const subboxStyle = {
  bgcolor: "#ffffff",
  p: 6,
  margin: "1em",
  justifyContent: "center",
  padding: "1.5rem",
};

const butonEnableStyle = {
  padding: "0.5rem",
  display: "block",
  margin: "auto",
  marginTop: "10%",
};

const butonDisableStyle = {
  padding: "0.5rem",
  display: "block",
  margin: "auto",
  marginTop: "5%",
};

export default function TwoFAModal(props: any) {
  const handleClose = () => props.setModal(false);
  const context = useContext(Context);
  const [activate, setActivate] = useState(context.user.two_factor_enabled);
  const [secret, setSecret] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [helperError, setHelperError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const nav = useNavigate();

  const handleEnableSubmit = async () => {
    setIsPending(true);
    fetch(api_url + "/2fa/turn-on", {
      method: "PUT",
      credentials: "include",
      referrerPolicy: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: secret }),
    })
      .then((res) => {
        if (res.status === 401) {
          nav("/login");
        } else if (!res.ok) {
          setTitleError(true);
          res.json().then((data) => {
            setHelperError(data.message);
          });
        } else {
          setActivate(true);
          context.setUpdate(!context.update);
        }
        setIsPending(false);
      })
      .catch((err) => {
        setTitleError(err.message);
        setIsPending(false);
      });
  };

  const handleDisableSubmit = async () => {
    setIsPending(true);
    fetch(api_url + "/2fa/turn-off", {
      method: "PUT",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (res.status === 401) {
          nav("/login");
        } else if (!res.ok) {
          setTitleError(true);
          res.json().then((data) => {
            setHelperError(data.message);
          });
        } else {
          setActivate(false);
          context.setUpdate(!context.update);
        }
        setIsPending(false);
      })
      .catch((err) => {
        setTitleError(err.message);
        setIsPending(false);
      });
  };

  return (
    <div>
      {!activate && (
        <Modal open={props.modalState} onClose={handleClose}>
          <Box sx={boxStyle} textAlign="center">
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h5" component="h3">
                  If you want to activate the two factors authentication, please
                  scan this QR Code and submit your secret.
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <img src={api_url + "/2fa/generate"}></img>
              </Grid>
              <Grid item xs={7}>
                <Box sx={subboxStyle} textAlign="center">
                  <TextField
                    className="twofa-text-field"
                    onChange={(e) => setSecret(e.target.value)}
                    label="2FA Secret"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    required
                    error={titleError}
                    helperText={helperError}
                  />
                  <div style={butonEnableStyle}>
                    {!isPending && (
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        endIcon={<Send />}
                        onClick={handleEnableSubmit}
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
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
      {activate && (
        <Modal open={props.modalState} onClose={handleClose}>
          <Box sx={boxStyle} textAlign="center">
            <Typography variant="h5" component="h3">
              DISABLE 2FA
            </Typography>
            <div style={butonDisableStyle}>
              {!isPending && (
                <Button
                  type="submit"
                  color="error"
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleDisableSubmit}
                >
                  Disable
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
      )}
    </div>
  );
}
