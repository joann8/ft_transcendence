import * as React from "react";
import { Fragment } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MainListItems from "./ListItems";
import { Avatar, Box, CircularProgress, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import useFromApi from "../../ApiCalls/useFromApi";
import { api_req_init, api_url } from "../../ApiCalls/var";

/* Notification clochette
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
*/

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function SideBar(props: any) {
  const [open, setOpen] = React.useState(true);
  useFromApi("/refresh");
  const { error, isPending, data: user } = useFromApi("/user");

  React.useEffect(() => {
    if (user) {
      window.addEventListener("beforeunload", (e) => {
        e.preventDefault();
        fetch(api_url + "/user", {
          method: "PUT",
          credentials: "include",
          referrerPolicy: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "OFFLINE" }),
        });
      });
    }
  }, [user]);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const mdTheme = createTheme();

  return (
    <Fragment>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Welcome to Transcendence!
              </Typography>
              {isPending && <CircularProgress />}
              {user && (
                <Typography sx={{ margin: 1 }}>{user.id_pseudo}</Typography>
              )}
              <Divider orientation="vertical" sx={{ margin: 1 }} />
              {isPending && <CircularProgress />}
              {user && <Avatar src={user.avatar}></Avatar>}
              <Divider orientation="vertical" sx={{ margin: 1 }} />
            </Toolbar>
          </AppBar>

          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            {isPending && <CircularProgress />}
            {user && <MainListItems role={user.role} />}
            <Divider />
          </Drawer>
          <Outlet />
        </Box>
      </ThemeProvider>
    </Fragment>
  );
}
