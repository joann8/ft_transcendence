//Cette page gère les icones listées dans le menu deroulant vertical + leur noms

import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlayIcon from "@mui/icons-material/PlayCircleOutlined";
import ChatIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import ProfileIcon from "@mui/icons-material/AccountCircleOutlined";
import LeaderIcon from "@mui/icons-material/EmojiEventsOutlined";
import HomeIcon from '@mui/icons-material/Home'; 
import Profile from "../Profile";
import Chat from "../Chat/Chat";
import Leaderboard from "../Leaderboard";

import GameMenu from "../Game/GameMenu";
import GamePage from "../Game/GamePage";
import { useNavigate } from "react-router";

/* Pour une deuxieme liste
import ListSubheader from '@mui/material/ListSubheader';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
*/

function MainListItems(props: any) {
  console.log(props.value);
  let navigate = useNavigate()
  return (
    <div>
      <ListItem button onClick={() => navigate("/")}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>

      <ListItem button onClick={() => navigate("/profile")}>
        <ListItemIcon>
          <ProfileIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>

      <ListItem button onClick={() => navigate("/game")}>
        <ListItemIcon>
          <PlayIcon />
        </ListItemIcon>
        <ListItemText primary="Game" />
      </ListItem>

      <ListItem button onClick={() => navigate("/leaderboard")}>
        <ListItemIcon>
          <LeaderIcon />
        </ListItemIcon>
        <ListItemText primary="Leaderboard" />
      </ListItem>

      <ListItem button onClick={() => navigate("/chat")}>
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary="Chat" />
      </ListItem>

    </div>
  );
}

export default MainListItems;

/*

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <ProfileIcon fontSize="large"/>
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PlayIcon fontSize="large"/>
      </ListItemIcon>
      <ListItemText primary="Game" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LeaderIcon fontSize="large" />
      </ListItemIcon>
      <ListItemText primary="Leaderboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ChatIcon fontSize="large"/>
      </ListItemIcon>
      <ListItemText primary="Chat" />
    </ListItem>
  
  </div>
);
*/

/* Pour faire un deuxieme sous menu
export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
*/
