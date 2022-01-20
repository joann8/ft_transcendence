import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MessagePostProps, Message } from "./types";
import { useState } from "react";

const useStyle = makeStyles({
  formMessageContainer: {
    height: "56px",
    justifyContent: "center",
    width: "100%",
  },
  submitButton: {
    height: "100%",
  },
  item: {
    backgroundColor: "white",
    width: "100%",
  },
});
function PostMessage({ submit }: MessagePostProps) {
  const [content, setContent] = useState<string>("");
  const classes = useStyle();
  return (
    <Grid container className={classes.formMessageContainer} columnSpacing={1}>
      <Grid item xs={8} md={8} lg={10}>
        <TextField
          id="outlined-basic"
          label="Message"
          variant="outlined"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setContent(e.currentTarget.value)
          }
          className={classes.item}
        />
      </Grid>
      <Grid item xs={4} md={4} lg={2}>
        <Button
          variant="contained"
          className={classes.submitButton}
          onClick={() => {
            if (content) {
              submit(content);
            }
            return;
          }}
        >
          SUBMIT
        </Button>
      </Grid>
    </Grid>
  );
}

export default PostMessage;
