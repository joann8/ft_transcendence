import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Grid, TextField, BottomNavigation } from "@mui/material";
import validator from "validator";
import { useNavigate } from "react-router";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85%",
  height: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const editLayout = {
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
  overflow: "auto",
};

export default function InfoModal(props: any) {
  const [pseudo, setPseudo] = React.useState("");
  const nav = useNavigate();

  function handleAccept() {
    if (!pseudo) {
      alert("Empty Fields : No change to submit");
      return;
    }
    if (pseudo) {
      if (!(validator.isAlpha(pseudo[0]) && validator.isAlphanumeric(pseudo)))
        return alert(
          "Pseudo must contain alpha numeric only and START with a letter"
        );
    }

    const update = {
      id_pseudo: pseudo,
    };

    fetch("http://127.0.0.1:3001/user", {
      method: "PUT",
      credentials: "include",
      referrerPolicy: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    })
      .then((res) => {
        if (res.status === 401) {
          nav("/login");
        } else if (!res.ok) {
          if (res.status === 409) throw new Error("Pseudo not available");
          else throw new Error(res.statusText);
        }
        res.json();
      })
      .then((data) => {
        console.log(data);
        props.setUpdate(!props.update);
        props.setModal(false);
      })
      .catch((err) => {
        alert(err);
      });
  }

  function handleChange(evt: any) {
    console.log("Change evt: ", evt);
    setPseudo(evt.target.value);
  }

  function handleSubmit(evt: any) {
    evt.preventDefault();
    handleAccept();
  }

  const handleClose = () => props.setModal(false);

  function handleKeyPress(evt: any) {
    console.log("Key press : ", evt);

    if (evt.key === "a") {
      handleChange(evt);
    }
  }

  return (
    <div>
      <Modal
        open={props.modalState}
        onClose={handleClose}
        onKeyDown={handleKeyPress}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="outlined"
              name="id_pseudo"
              label="Pseudo"
              defaultValue={pseudo}
              onChange={handleChange}
            />
          </Box>
          <Grid container columns={12} spacing={2} style={editLayout}>
            <br />
            <Grid item xs={6}></Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#22c863",
                  color: "#FFFFFF",
                  width: "30%",
                  marginLeft: "5%",
                  marginTop: "10px",
                  marginRight: "5%",
                }}
                onClick={handleAccept}
              >
                {" "}
                Accept{" "}
              </Button>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "#c84322",
                  marginLeft: "5%",
                  marginTop: "10px",
                  marginRight: "5%",
                  color: "#FFFFFF",
                  width: "30%",
                }}
                onClick={handleClose}
              >
                {" "}
                Cancel{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
