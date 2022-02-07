import {
  Paper,
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { LockOpenTwoTone, LockTwoTone } from "@mui/icons-material";
import { useNavigate } from "react-router";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import MatchModal from "./MatchModal";
import profileStyle from "./profileStyle";
import { IUser } from "./profileStyle";
import FriendRequestModal from "./FriendRequestModal";
import { Context } from "../MainCompo/SideBars";

export default function Profile() {
  const context = useContext(Context);

  const [searchInput, setSearchInput] = useState("");
  const [modalState, setModal] = useState({
    match: false,
    info: false,
    avatar: false,
    friend: false,
  });
  const [update, setUpdate] = useState(0);
  //   const [userData, setUserData] = useState(defaultUser)
  const [userData, setUserData] = useState<IUser>(context.user);

  const navigate = useNavigate();

  useEffect(() => {
    //  console.log("Search bar : ", searchInput)
  });

  useEffect(
    () => {
      //    getUserData()
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

  const handleAuth = () => {
    context.setUpdate(!context.update);
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
              <Box sx={profileStyle.content_2}>
                <Avatar
                  src={userData.avatar}
                  style={{
                    width: "125px",
                    height: "125px",
                    overflow: "hidden",
                  }}
                />
              </Box>
              <Divider
                orientation="vertical"
                sx={{ height: "50%", backgroundColor: "rgba(191, 85, 236, 1)" }}
              />
              <Box sx={profileStyle.content_1}>
                <Typography style={profileStyle.textBox}>
                  {userData.id_pseudo}
                </Typography>
                <Typography style={profileStyle.textBox}>
                  {userData.elo}
                </Typography>
                <Typography style={profileStyle.textBox}>
                  {userData.email}
                </Typography>
              </Box>
              <Divider
                orientation="vertical"
                sx={{
                  height: "50%",
                  backgroundColor: "rgba(191, 85, 236, 1)",
                }}
              />
              <Box sx={profileStyle.content_2}>
                <Button
                  variant="contained"
                  startIcon={<NotificationAddIcon color="error" />}
                  onClick={() => {
                    setModal({ ...modalState, friend: true });
                  }}
                >
                  Friend Request
                </Button>
                {modalState.friend ? (
                  <FriendRequestModal
                    user={userData}
                    modalState={modalState.friend}
                    setModal={setModal}
                    update={update}
                    setUpdate={setUpdate}
                  />
                ) : null}
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
