import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import useFromApi from "../../ApiCalls/useFromApi";
import { Box, CircularProgress } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    align: "center",
    headerAlign: "center",
    minWidth: 130,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
  {
    field: "id_pseudo",
    headerName: "Pseudo",
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
  {
    field: "email",
    headerName: "Email",
    align: "center",
    headerAlign: "center",
    minWidth: 250,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
  {
    field: "role",
    headerName: "Role",
    align: "center",
    headerAlign: "center",
    minWidth: 130,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
];

function _isRowSelectable(param: GridRowParams, user_rights: string): boolean {
  if (param.row.role === "owner") {
    return false;
  } else if (user_rights === "owner") {
    return true;
  } else if (param.row.role === "admin") {
    return false;
  } else {
    return true;
  }
}

export default function UsersTable(props) {
  const { error, isPending, data: users } = useFromApi("/admin/users");

  return (
    <Box sx={{ width: "100%", "& .grid-header-theme": { fontWeight: "bold" } }}>
      {isPending && <CircularProgress />}
      {users && (
        <DataGrid
          rows={users}
          columns={columns}
          checkboxSelection
          autoHeight
          isRowSelectable={(param: GridRowParams) =>
            _isRowSelectable(param, props.role)
          }
          components={{ Toolbar: GridToolbar }}
        />
      )}
    </Box>
  );
}
