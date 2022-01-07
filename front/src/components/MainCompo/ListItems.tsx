//Cette page gère les icones listées dans le menu deroulant vertical + leur noms

import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlayIcon from "@mui/icons-material/PlayCircleOutlined";
import ChatIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import ProfileIcon from "@mui/icons-material/AccountCircleOutlined";
import LeaderIcon from "@mui/icons-material/EmojiEventsOutlined";
import Profile from "../Profile";
import Chat from "../Chat/Chat";
import Game from "../Game";
import Leaderboard from "../Leaderboard";
/* Pour une deuxieme liste
import ListSubheader from '@mui/material/ListSubheader';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
*/

const pageList = {
  test: <Leaderboard />,
  profile: <Profile />,
  chat: <Chat />,
  game: <Game />,
};

function MainListItems(props: any) {
  console.log(props.value);
  return (
    <div>
      <ListItem button onClick={() => props.handleCanvas(pageList.profile)}>
        <ListItemIcon>
          <ProfileIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>

      <ListItem button onClick={() => props.handleCanvas(pageList.game)}>
        <ListItemIcon>
          <PlayIcon />
        </ListItemIcon>
        <ListItemText primary="Game" />
      </ListItem>

      <ListItem button onClick={() => props.handleCanvas(pageList.test)}>
        <ListItemIcon>
          <LeaderIcon />
        </ListItemIcon>
        <ListItemText primary="Leaderboard" />
      </ListItem>

      <ListItem button onClick={() => props.handleCanvas(pageList.chat)}>
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
        <ProfileIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PlayIcon />
      </ListItemIcon>
      <ListItemText primary="Game" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LeaderIcon />
      </ListItemIcon>
      <ListItemText primary="Leaderboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ChatIcon />
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
