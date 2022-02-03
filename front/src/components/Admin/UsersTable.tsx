import * as React from "react";
import {
  DataGrid,
  GridApi,
  GridCellValue,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import useFromApi from "../../ApiCalls/useFromApi";
import { Box, Button, CircularProgress } from "@mui/material";

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
  {
    field: "action",
    headerName: "Action",
    sortable: false,
    renderCell: (params) => {
      const onClick = (e) => {
        e.stopPropagation(); // don't select this row after clicking

        const api: GridApi = params.api;
        const thisRow: Record<string, GridCellValue> = {};

        api
          .getAllColumns()
          .filter((c) => c.field !== "__check__" && !!c)
          .forEach(
            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
          );

        return alert(JSON.stringify(thisRow, null, 4));
      };

      return <Button onClick={onClick}>Click</Button>;
    },
  },
];

export default function UsersTable(props) {
  const { error, isPending, data: users } = useFromApi("/admin/users");

  return (
    <Box sx={{ width: "100%", "& .grid-header-theme": { fontWeight: "bold" } }}>
      {isPending && <CircularProgress />}
      {users && (
        <DataGrid
          rows={users}
          columns={columns}
          autoHeight
          components={{ Toolbar: GridToolbar }}
        />
      )}
    </Box>
  );
}
