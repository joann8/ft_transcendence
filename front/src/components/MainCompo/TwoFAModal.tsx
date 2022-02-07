import { Send } from "@mui/icons-material";
import { Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { api_url } from "../../ApiCalls/var";
import { Context } from "./SideBars";

// TODO:
//

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

const butonStyle = {
  padding: "0.5rem",
  display: "block",
  margin: "auto",
};

export default function TwoFAModal(props: any) {
  const handleClose = () => props.setModal(false);
  const context = useContext(Context);
  const [activate, setActivate] = useState(context.user.two_factor);
  const [secret, setSecret] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [helperError, setHelperError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async () => {};

  return (
    <div>
      <Modal open={props.modalState} onClose={handleClose}>
        {!activate && (
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
              </Grid>
            </Grid>
          </Box>
        )}
      </Modal>
    </div>
  );
}
