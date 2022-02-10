import * as React from "react";
import { createContext, Fragment, useEffect } from "react";
import {
  styled,
  createTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MainListItems from "./ListItems";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Menu,
  MenuItem,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import { IUser } from "../Profile/profileStyle";
import { api_url } from "../../ApiCalls/var";
import TwoFAModal from "./TwoFAModal";

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

interface IContext {
  user: IUser;
  update: boolean;
  setUpdate: any;
}

export const Context = createContext<IContext>(null);

export default function SideBar(props: any) {
  const [open, setOpen] = React.useState(true);
  const [twofaModal, setTwofaModal] = React.useState(false);
  const [update, setUpdate] = React.useState(true);
  const [user, setUser] = React.useState<IUser>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // const { error, isPending, data: user } = useFromApi("/user");

  const navigate = useNavigate();

  const getUserData = async () => {
    await fetch(api_url + `/user`, {
      method: "GET",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
        } else if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((resData) => {
        setUser(resData);
      })
      .catch((err) => {
        console.error("Error caught: ", err);
      });
  };

  const refreshTokens = async () => {
    await fetch(api_url + `/refresh`, {
      method: "GET",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
        } else if (!res.ok) {
          throw new Error(res.statusText);
        }
      })
      .catch((err) => {
        console.error("Error caught: ", err);
      });
  };

  useEffect(() => {
    getUserData();
    refreshTokens();
  }, [update]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleEditClose = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  if (!user) {
    return <Fragment />;
  } else {
    return (
      <Fragment>
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
              {user && (
                <Button
                  variant="outlined"
                  style={{ textTransform: "none", margin: 1 }}
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  <Typography sx={{ color: "#FFFFFF", margin: 1 }}>
                    {user.id_pseudo}
                  </Typography>
                  <Avatar src={user.avatar} style={{ margin: 1 }} />
                </Button>
              )}

              <Divider orientation="vertical" sx={{ margin: 1 }} />
              {user && (
                <Fragment>
                  <Context.Provider
                    value={{
                      user: user,
                      update: update,
                      setUpdate: setUpdate,
                    }}
                  >
                    <Button
                      size="small"
                      style={{
                        border: "1px solid white",
                        color: "#FFFFFF",
                        margin: 1,
                      }}
                      startIcon={<EditIcon />}
                      onClick={handleEditOpen}
                    >
                      Edit
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleEditClose}
                    >
                      <MenuItem onClick={() => navigate("/edit")}>
                        {" "}
                        Profile{" "}
                      </MenuItem>
                      <MenuItem onClick={() => setTwofaModal(true)}>
                        Two Factors
                      </MenuItem>
                      <TwoFAModal
                        modalState={twofaModal}
                        setModal={setTwofaModal}
                      />
                    </Menu>
                  </Context.Provider>
                </Fragment>
              )}
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
            <Context.Provider
              value={{
                user: user,
                update: update,
                setUpdate: setUpdate,
              }}
            >
              <MainListItems />
            </Context.Provider>
            <Divider />
          </Drawer>
          <Context.Provider
            value={{
              user: user,
              update: update,
              setUpdate: setUpdate,
            }}
          >
            <Outlet />
          </Context.Provider>
        </Box>
      </Fragment>
    );
  }
}
