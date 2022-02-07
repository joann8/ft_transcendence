import * as React from "react";
import { createContext, Fragment, useEffect } from "react";
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
import AvatarModal from "./AvatarModal";
import InfoModal from "./InfoModal ";
import { IUser } from "../Profile/profileStyle";
import { api_url } from "../../ApiCalls/var";

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
  user: IUser,
  update: boolean,
  setUpdate: any
}

export const Context = createContext<IContext>(null);

export default function SideBar(props: any) {
  /*
    const eventSource = new EventSource('http://127.0.0.1:3001/sse');
    eventSource.onmessage = ({data}) => {
      console.log('New message', JSON.parse(data));
      console.log('New message', data);
    };
  */
  const [open, setOpen] = React.useState(true);
  const [avatarModal, setAvatarModal] = React.useState(false);
  const [pseudoModal, setPseudoModal] = React.useState(false);
  const [update, setUpdate] = React.useState(true);
  const [user, setUser] = React.useState<IUser>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // const { error, isPending, data: user } = useFromApi("/user");

  const navigate = useNavigate();

  const getUserData = async () => {
    await fetch(`http://127.0.0.1:3001/user`, {
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
        // console.log("UserData : ", resData)
      })
      .catch((err) => {
        console.log("Error caught: ", err);
      });
  };

  useEffect(() => {
    getUserData();
    //Ajouter getRefreshToken()
  }, [update]);

  React.useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      if (user) {
        fetch(api_url + "/user", {
          method: "PUT",
          credentials: "include",
          referrerPolicy: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "OFFLINE" }),
        });
      }
    });
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleEditClose = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const mdTheme = createTheme();

  if (!user) {
    return <Fragment />;
  } else {
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
                {/* Notification clochette en haut a droite
                            <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                            
                            </IconButton>
                
                            */}
                {user && (
                  <Typography sx={{ margin: 1 }}>{user.id_pseudo}</Typography>
                )}
                <Divider orientation="vertical" sx={{ margin: 1 }} />
                {user && <Avatar src={user.avatar}></Avatar>}

                <Divider orientation="vertical" sx={{ margin: 1 }} />
                {user && (
                  <Fragment>
                    <Context.Provider value={{
                      user: user,
                      update: update,
                      setUpdate: setUpdate
                    }}>                    <Button style={{ border: "1px solid white", color: "#FFFFFF" }}
                      startIcon={<EditIcon />}
                      onClick={handleEditOpen}>
                        Edit
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleEditClose}
                      >
                        <MenuItem onClick={() => setPseudoModal(true)}> Pseudo </MenuItem>
                        <InfoModal modalState={pseudoModal} setModal={setPseudoModal}/>
                        <MenuItem onClick={() => setAvatarModal(true)}> Avatar </MenuItem>
                        <AvatarModal modalState={avatarModal} setModal={setAvatarModal}/>
                      </Menu>
                      </Context.Provider>
                  </Fragment>}
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
              <Context.Provider value={{
                user: user,
                update: update,
                setUpdate: setUpdate
              }}>
                <MainListItems />
              </Context.Provider>
              <Divider />
            </Drawer>
            <Context.Provider value={{
              user: user,
              update: update,
              setUpdate: setUpdate
            }}>
              <Outlet />
            </Context.Provider>
          </Box>
        </ThemeProvider>
      </Fragment>
    );
  }
}
