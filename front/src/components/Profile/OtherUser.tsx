import {
  Toolbar,
  Paper,
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  ButtonGroup,
} from "@mui/material";
import React, { Fragment, useContext, useEffect,  useState } from "react";
import Badge from "@mui/material/Badge";
import { useNavigate, useParams } from "react-router";
import MatchModal from "./MatchModal";
import profileStyle from "./profileStyle";
import {
  LockTwoTone,
  Pending,
  PersonAdd,
  QuestionMark,
} from "@mui/icons-material";
import { Context } from "../MainCompo/SideBars";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarsIcon from "@mui/icons-material/Stars";
import FaceIcon from "@mui/icons-material/Face";
import { api_url } from "../../ApiCalls/var";

export default function OtherUser() {
  //Needs to be called on every render
  const params = useParams();
  const navigate = useNavigate();
  const context = useContext(Context);

  const [loaded, setLoaded] = useState(false);
  const [otherUserData, setOtherUserData] = useState(null);
  const [relation, setRelation] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [idPseudo, setIdPseudo] = useState(params.id_pseudo);
  const [modalState, setModal] = useState({
    match: false,
  });
  const [update, setUpdate] = useState(false);

  const getAllInfo = async () => {
    const tmpOtherUserData = await getOtherUserData(idPseudo);
    if (!tmpOtherUserData) return;
    await getRelation(context.user.id_pseudo, tmpOtherUserData.id_pseudo);
  }
  
  useEffect(() => {
    getAllInfo();
  }, [idPseudo, update, context.user]);



  const getOtherUserData = async (id_pseudo: string) => {
    const tmpOtherUserData = await fetch(api_url + `/user/${id_pseudo}`, {
      method: "GET",
      credentials: "include",
      referrerPolicy: "same-origin",
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login")
          throw new Error("Unauthorized")
        }
        else if (res.status === 404)
          return null
        else if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((resData) => {
        setOtherUserData(resData);
        return resData;
      })
      .catch((err) => {
        alert(err)
      });
    setLoaded(true);
    return tmpOtherUserData;
  };

  const getRelation = async (myPseudo: string, otherUserPseudo: string) => {
    const relationData = await fetch(
      api_url + `/relation/one/${otherUserPseudo}`,
      {
        credentials: "include",
        referrerPolicy: "same-origin",
        method: "GET",
      }
    )
      .then((res) => {
        if (res.status === 401) {
          navigate("/login")
          throw new Error("Unauthorized")
        }
        else if (!res.ok) {
          throw new Error(res.statusText);
        }
        if (res.status === 204)
          return 0;
        else
          return res.json();
      })
      .then((resData) => {
        //ResData = Relation
        //Cherche la bonne relation dans la bonne case
        if (resData)
          resData =
            myPseudo === resData.userId1.id_pseudo
              ? resData.relation1
              : resData.relation2;
        else resData = 0;
        setRelation(resData);
        return resData;
      })
      .catch((err) => {
        alert(err);
      });
    return relationData;
  };

  const updateRelation = async (
    otherUserPseudo: string,
    newRelation1: number,
    newRelation2: number
  ) => {
    const ret = await fetch(api_url + `/relation/update`, {
      credentials: "include",
      referrerPolicy: "same-origin",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_pseudo2: otherUserPseudo,
        relation1: newRelation1,
        relation2: newRelation2,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login")
          throw new Error("Unauthorized")
        }
        else if (!res.ok)
          throw new Error(res.statusText);
        else
          return true;
      })
      .catch((err) => {
        alert(`${err}`);
        return false;
      });
    return ret;
  };

  //Change l'URL et update le profile a charger
  const handleSearchBarSubmit = (event) => {
    event.preventDefault();
    navigate(`/profile/${searchInput}`);
    setIdPseudo(searchInput);
    setUpdate(!update);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleAddFriend = async (status: number) => {
    if (status === 0) await updateRelation(otherUserData.id_pseudo, 1, 2);
    else await updateRelation(otherUserData.id_pseudo, 3, 3);
    setUpdate(!update);
  };



  function FriendButton({ status }) {
    //FRIEND
    //MAKE BUTTON MENU
    if (status === 4) {
      return (
        <Fragment>
          <Button sx={{ margin: "2px" }} variant="contained" color="error" startIcon={<LockTwoTone />}>
            BLOCKED
          </Button>
        </Fragment >
      )
    }
    if (status === 3) {
      return (
        <Fragment>
          <Button sx={{ margin: "2px" }} variant="contained" color="success" startIcon={<FaceIcon />}>
            Friends
          </Button>
        </Fragment >
      )
    }
    //ADD or WAITING or ACCEPT
    else {
      let addButton: string
      if (status === 2)
        addButton = "Accept"
      else
        addButton = (status === 0 ? "Add" : "Waiting")
      return (
        <Button variant="contained"
          disabled={status === 1 ? true : false}
          style={{
            margin: "2px",
            backgroundColor: "rgba(255,255,255, 1)",
            color: "rgba(0,0,0,1)"
          }}
          startIcon={(status === 2) ? <QuestionMark /> : (status === 0 ? <PersonAdd /> : <Pending />)}
          onClick={() => { handleAddFriend(status) }}>
          {addButton}
        </Button>
      )
    }
  }

  function ButtonBlock({ status }) {
    return (
      <Fragment>
        {otherUserData.achievement1 ? <Chip sx={{ margin: "2px" }} icon={<StarsIcon />} label="Win with Max Score (3-0)" color="success" /> : <Chip sx={{ margin: "2px" }} icon={<StarsIcon />} label="Win with Max Score (3-0)" variant="outlined" color="secondary" />}
        {otherUserData.achievement2 ? <Chip sx={{ margin: "2px" }} icon={<EmojiEventsIcon />} label="Win 3 times" color="success" /> : <Chip sx={{ margin: "2px" }} icon={<EmojiEventsIcon />} label="Win 3 times" variant="outlined" color="secondary" />}
        {otherUserData.id !== context.user.id && <FriendButton status={status} />}
      </Fragment>
    )
  }

  //LOADING
  if (loaded === false) {
    return <Fragment></Fragment>;
  }
  //USER INEXISTENT or BLOCKED
  if (relation === 5 || otherUserData === null) {
    return (
      <Fragment>
        <Paper sx={profileStyle.layout}>
          <Toolbar />
          <Box sx={profileStyle.boxStyle}>
            <Box sx={profileStyle.container}>
              <Box
                component="form"
                sx={profileStyle.searchBar}
                onSubmit={handleSearchBarSubmit}
              >
                <TextField
                  fullWidth
                  sx={{ input: { color: "purple" } }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: "rgba(255, 255, 255, 0.8)",
                    border: "1px purple",
                    borderRadius: "10px",
                  }}
                  label="Search for players"
                  defaultValue={searchInput}
                  onChange={handleSearchChange}
                />
              </Box>
              <Box sx={profileStyle.profileBlock}>
                <Box sx={profileStyle.middleBox}>
                  <Typography style={{ color: "#FFFFFF" }}>
                    {" "}
                    Sorry, there is no player with pseudo : [ {idPseudo} ]{" "}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fragment>
    );
  }
  //Render OTHERUSER PROFILE
  else {
    return (
      <Fragment>
        <Paper sx={profileStyle.layout}>
          <Toolbar />
          <Box sx={profileStyle.boxStyle}>
            <Box sx={profileStyle.container}>
              <Box
                component="form"
                sx={profileStyle.searchBar}
                onSubmit={handleSearchBarSubmit}
              >
                <TextField
                  fullWidth
                  sx={{ input: { color: "purple" } }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: "rgba(255, 255, 255, 0.8)",
                    border: "1px purple",
                    borderRadius: "10px",
                  }}
                  label="Search for players"
                  defaultValue={searchInput}
                  onChange={handleSearchChange}
                />
              </Box>

              <Box sx={profileStyle.profileBlock}>
                <Box sx={profileStyle.leftRightBox}>
                  {context.user.id !== otherUserData.id ? (
                    <Badge
                      overlap="circular"
                      badgeContent={otherUserData.status}
                      color="secondary"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                      <Avatar
                        src={otherUserData.avatar}
                        style={{
                          width: "125px",
                          height: "125px",
                          overflow: "hidden",
                        }}
                      />
                    </Badge>
                  ) : (
                    <Avatar
                      src={otherUserData.avatar}
                      style={{
                        width: "125px",
                        height: "125px",
                        overflow: "hidden",
                      }}
                    />
                  )}
                </Box>
                <Divider orientation="vertical" sx={profileStyle.divider} />
                <Box sx={profileStyle.middleBox}>
                  <Typography style={profileStyle.text}>
                    {" "}
                    {otherUserData.id_pseudo}
                  </Typography>
                  <Typography style={profileStyle.text}>
                    {" "}
                    {otherUserData.elo}{" "}
                  </Typography>
                  <Typography style={profileStyle.text}>
                    {otherUserData.email}
                  </Typography>
                </Box>
                <Divider orientation="vertical" sx={profileStyle.divider} />
                <Box sx={profileStyle.leftRightBox}>
                  <ButtonGroup orientation="vertical">
                    <ButtonBlock status={relation} />
                  </ButtonGroup>
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
                    user={otherUserData}
                  />
                ) : null}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fragment>
    );
  }
}