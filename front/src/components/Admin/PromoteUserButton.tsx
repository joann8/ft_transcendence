import { Button } from "@mui/material";
import { api_url } from "../../ApiCalls/var";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Fragment } from "react";

function isSetAdminButtonDisabled(user: any): boolean {
  if (user.role === "owner" || user.role === "admin") {
    return true;
  } else {
    return false;
  }
}

function isRemoveAdminButtonDisabled(user: any): boolean {
  if (user.role === "owner" || user.role !== "admin") {
    return true;
  } else {
    return false;
  }
}

export default function PromoteUserButton(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [disableSetAdminButton, setDisableSetAdminButton] = useState(
    isSetAdminButtonDisabled(props.params.row)
  );
  const [disableRemoveAdminButton, setDisableRemoveAdminButton] = useState(
    isRemoveAdminButtonDisabled(props.params.row)
  );
  const [isAdmin, setIsAdmin] = useState(
    props.params.row.role === "owner" || props.params.row.role === "admin"
  );

  const handleSetAdmin = (e) => {
    e.stopPropagation();
    setDisableSetAdminButton(true);
    fetch(api_url + "/admin/" + props.params.row.id_pseudo, {
      method: "PUT",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then((data) => {
            enqueueSnackbar(
              props.params.row.id_pseudo +
                " has not been promoted to admin: " +
                data.message,
              {
                variant: "error",
              }
            );
          });
        } else {
          enqueueSnackbar(props.params.row.id_pseudo + " is now an admin !", {
            variant: "success",
          });
          setIsAdmin(true);
          props.params.row.role = "admin";
          props.params.api.forceUpdate();
        }
        setDisableRemoveAdminButton(false);
      })
      .catch((err) => {
        enqueueSnackbar(
          props.params.row.id_pseudo +
            " has not been promoted to admin: " +
            err.message,
          {
            variant: "error",
          }
        );
        setDisableRemoveAdminButton(false);
      });
  };

  const handleRemoveAdmin = (e) => {
    e.stopPropagation();
    setDisableRemoveAdminButton(true);
    fetch(api_url + "/admin/" + props.params.row.id_pseudo, {
      method: "DELETE",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then((data) => {
            enqueueSnackbar(
              props.params.row.id_pseudo +
                " is still an admin: " +
                data.message,
              {
                variant: "error",
              }
            );
          });
        } else {
          enqueueSnackbar(
            props.params.row.id_pseudo + " is not an admin anymore !",
            {
              variant: "success",
            }
          );
          setIsAdmin(false);
          props.params.row.role = "user";
          props.params.api.forceUpdate();
        }
        setDisableSetAdminButton(false);
      })
      .catch((err) => {
        enqueueSnackbar(
          props.params.row.id_pseudo + " is still an admin: " + err.message,
          {
            variant: "error",
          }
        );
        setDisableSetAdminButton(false);
      });
  };

  return (
    <Fragment>
      {!isAdmin && (
        <Button
          variant="contained"
          color="success"
          onClick={handleSetAdmin}
          disabled={disableSetAdminButton}
        >
          ADM
        </Button>
      )}
      {isAdmin && (
        <Button
          variant="contained"
          color="error"
          onClick={handleRemoveAdmin}
          disabled={disableRemoveAdminButton}
        >
          USR
        </Button>
      )}
    </Fragment>
  );
}
