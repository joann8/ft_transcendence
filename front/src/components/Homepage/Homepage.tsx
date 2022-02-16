import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Image from "../Images/doll.jpg";
import { Fragment, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

export default function Homepage(props: any) {
  const styles = {
    backgroundImage: {
      backgroundImage: `url(${Image})`,
      backgroundPosition: "left",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      width: "100%",
      height: "100%",
      overflow: "auto",
    },
  };

  let navigate = useNavigate();
  return (
    <Fragment>
      <Paper style={styles.backgroundImage}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          style={{ height: "100vh" }}
        >
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              style={{ fontSize: 50 }}
              onClick={() => navigate("/game")}
            >
              {" "}
              Let's play!
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Fragment>
  );
}
