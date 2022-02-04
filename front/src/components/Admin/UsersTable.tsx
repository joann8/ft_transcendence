import * as React from "react";
import {
  DataGrid,
  GridApi,
  GridCellValue,
  GridColDef,
  GridRowParams,
  GridToolbar,
  GridValueSetterParams,
} from "@mui/x-data-grid";
import useFromApi from "../../ApiCalls/useFromApi";
import { Box, Button, CircularProgress } from "@mui/material";
import { api_url } from "../../ApiCalls/var";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import BanUserButton from "./BanUserButton";
import PromoteUserButton from "./PromoteUserButton";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    align: "center",
    headerAlign: "center",
    minWidth: 40,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
  {
    field: "id_pseudo",
    headerName: "Pseudo",
    align: "center",
    headerAlign: "center",
    minWidth: 100,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
  {
    field: "email",
    headerName: "Email",
    align: "center",
    headerAlign: "center",
    minWidth: 220,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
  {
    field: "status",
    headerName: "Status",
    align: "center",
    headerAlign: "center",
    minWidth: 40,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
  {
    field: "role",
    headerName: "Role",
    align: "center",
    headerAlign: "center",
    minWidth: 30,
    flex: 1,
    headerClassName: "grid-header-theme",
  },
  {
    field: "banning",
    headerName: "Ban/Unban",
    headerAlign: "center",
    align: "center",
    sortable: false,
    filterable: false,
    minWidth: 70,
    flex: 1,
    renderCell: (params) => {
      return <BanUserButton params={params} />;
    },
  },
  {
    field: "promote",
    headerName: "Admin/User",
    headerAlign: "center",
    align: "center",
    sortable: false,
    filterable: false,
    minWidth: 70,
    flex: 1,
    renderCell: (params) => {
      return <PromoteUserButton params={params} />;
    },
  },
];

export default function UsersTable(props) {
  const { error, isPending, data: users } = useFromApi("/admin/users");

  return (
    <Box sx={{ width: "100%", "& .grid-header-theme": { fontWeight: "bold" } }}>
      <SnackbarProvider maxSnack={5}>
        {isPending && <CircularProgress />}
        {users && (
          <DataGrid
            rows={users}
            columns={columns}
            autoHeight
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </SnackbarProvider>
    </Box>
  );
}
