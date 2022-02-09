import {
  Paper,
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MatchModal from "./MatchModal";
import profileStyle from "./profileStyle";
import { IUser } from "./profileStyle";
import { Context } from "../MainCompo/SideBars";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarsIcon from '@mui/icons-material/Stars';

export default function Profile() {
  const context = useContext(Context);

  const [searchInput, setSearchInput] = useState("");
  const [modalState, setModal] = useState({
    match: false,
    info: false,
    avatar: false,
    friend: false,
  });
  const [userData, setUserData] = useState<IUser>(context.user);

  const navigate = useNavigate();


  useEffect(
    () => {
      setUserData(context.user);
    },
    [context.user] /*[value, update]*/
  );

  const handleSearchBarSubmit = async (event) => {
    event.preventDefault();
    navigate(`/profile/${searchInput}`);
  };

  const handleSearchChange = (event: any) => {
    setSearchInput(event.target.value);
  };



  return (
    <Fragment>
      <Paper sx={profileStyle.layout}>
        <Box sx={profileStyle.boxStyle}>
          <Box sx={profileStyle.container}>
            <Box
              component="form"
              sx={profileStyle.searchBar}
              onSubmit={handleSearchBarSubmit}
            >
              <TextField
                fullWidth
                label="Search for players"
                defaultValue={searchInput}
                onChange={handleSearchChange}
                sx={{ input: { color: "purple" } }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  color: "rgba(255, 255, 255, 0.8)",
                  border: "1px purple",
                  borderRadius: "10px",
                }}
              />
            </Box>

            <Box sx={profileStyle.profileBlock}>
              <Box sx={profileStyle.leftRightBox}>
                <Avatar
                  src={userData.avatar}
                  style={{
                    border: "2px solid rgba(125, 125, 125)",
                    width: "125px",
                    height: "125px",
                  }}
                />
              </Box>

              <Divider orientation="vertical" sx={profileStyle.divider} />

              <Box sx={profileStyle.middleBox}>
                <Typography style={profileStyle.text}>
                  {userData.id_pseudo}
                </Typography>
                <Typography style={profileStyle.text}>
                  {userData.elo}
                </Typography>
                <Typography style={profileStyle.text}>
                  {userData.email}
                </Typography>
              </Box>
              <Divider orientation="vertical" sx={profileStyle.divider} />
              <Box sx={profileStyle.leftRightBox}>
                {context.user.achievement1 ? <Chip icon={<StarsIcon />} label="Win with Max Score (3-0)" color="success" /> : <Chip icon={<StarsIcon />} label="Win with Max Score (3-0)" variant="outlined" color="secondary" />}
                {context.user.achievement2 ? <Chip icon={<EmojiEventsIcon />} label="Win 3 times" color="success" /> : <Chip icon={<EmojiEventsIcon />} label="Win 3 times" variant="outlined" color="secondary" />}
       

              </Box>
            </Box>

            <Box sx={profileStyle.matchHistory}>
              <Button
                variant="contained"
                onClick={() => {
                  setModal({ ...modalState, match: true });
                }}
                sx={{ width: "100%" }}
              >
                {" "}
                Match history{" "}
              </Button>
              {modalState.match ? (
                <MatchModal
                  modalState={modalState.match}
                  setModal={setModal}
                  user={context.user}
                />
              ) : null}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Fragment>
  );
}
