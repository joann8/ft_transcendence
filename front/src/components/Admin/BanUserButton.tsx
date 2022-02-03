import { Button } from "@mui/material";
import { api_url } from "../../ApiCalls/var";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Fragment } from "react";

function isBannableButtonDisabled(user: any): boolean {
  if (user.role === "owner" || user.status === "BAN") {
    return true;
  } else {
    return false;
  }
}

function isUnbannableButtonDisabled(user: any): boolean {
  if (user.role === "owner" || user.status !== "BAN") {
    return true;
  } else {
    return false;
  }
}

export default function BanUserButton(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [disableBan, setDisableBan] = useState(
    isBannableButtonDisabled(props.params.row)
  );
  const [disableUnban, setDisableUnban] = useState(
    isUnbannableButtonDisabled(props.params.row)
  );
  const [isBan, setIsBan] = useState(props.params.row.status === "BAN");

  const handleBan = (e) => {
    e.stopPropagation();
    setDisableBan(true);
    fetch(api_url + "/admin/ban/" + props.params.row.id_pseudo, {
      method: "PUT",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then((data) => {
            enqueueSnackbar(
              props.params.row.id_pseudo +
                " has not been banned: " +
                data.message,
              {
                variant: "error",
              }
            );
          });
        } else {
          enqueueSnackbar(props.params.row.id_pseudo + " has been banned !", {
            variant: "success",
          });
          setIsBan(true);
          props.params.row.status = "BAN";
          props.params.api.forceUpdate();
        }
        setDisableUnban(false);
      })
      .catch((err) => {
        enqueueSnackbar(
          props.params.row.id_pseudo + " has not been banned: " + err.message,
          {
            variant: "error",
          }
        );
        setDisableUnban(false);
      });
  };

  const handleUnban = (e) => {
    e.stopPropagation();
    setDisableUnban(true);
    fetch(api_url + "/admin/unban/" + props.params.row.id_pseudo, {
      method: "PUT",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then((data) => {
            enqueueSnackbar(
              props.params.row.id_pseudo + " is still ban: " + data.message,
              {
                variant: "error",
              }
            );
          });
        } else {
          enqueueSnackbar(
            props.params.row.id_pseudo + " is not ban anymore !",
            {
              variant: "success",
            }
          );
          setIsBan(false);
          props.params.row.status = "OFFLINE";
          props.params.api.forceUpdate();
        }
        setDisableBan(false);
      })
      .catch((err) => {
        enqueueSnackbar(
          props.params.row.id_pseudo + " is still ban: " + err.message,
          {
            variant: "error",
          }
        );
        setDisableBan(false);
      });
  };

  return (
    <Fragment>
      {!isBan && (
        <Button
          variant="contained"
          color="error"
          onClick={handleBan}
          disabled={disableBan}
        >
          BAN
        </Button>
      )}
      {isBan && (
        <Button
          variant="contained"
          color="success"
          onClick={handleUnban}
          disabled={disableUnban}
        >
          UNBAN
        </Button>
      )}
    </Fragment>
  );
}
