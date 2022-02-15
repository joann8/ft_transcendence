import { Button } from "@mui/material";
import { api_url } from "../../ApiCalls/var";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useContext } from "react";
import { Fragment } from "react";
import { Context } from "../MainCompo/SideBars";
import { IUser } from "../Profile/profileStyle";
import { useNavigate } from "react-router";

function isBannableButtonDisabled(
  row_user: IUser,
  current_user: IUser
): boolean {
  if (row_user.role === "owner" || row_user.status === "BAN") {
    return true;
  } else if (row_user.role === "admin" && current_user.role === "admin") {
    return true;
  } else {
    return false;
  }
}

function isUnbannableButtonDisabled(
  row_user: IUser,
  current_user: IUser
): boolean {
  if (row_user.role === "owner" || row_user.status !== "BAN") {
    return true;
  } else if (row_user.role === "admin" && current_user.role === "admin") {
    return true;
  } else {
    return false;
  }
}

export default function BanUserButton(props) {
  const user = useContext(Context).user;
  const { enqueueSnackbar } = useSnackbar();
  const [disableBan, setDisableBan] = useState(
    isBannableButtonDisabled(props.params.row, user)
  );
  const [disableUnban, setDisableUnban] = useState(
    isUnbannableButtonDisabled(props.params.row, user)
  );
  const [isBan, setIsBan] = useState(props.params.row.status === "BAN");
  const naviguate = useNavigate();

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
          if (res.status === 401) {
            naviguate("/login");
          }
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
          if (res.status === 401) {
            naviguate("/login");
          }
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
