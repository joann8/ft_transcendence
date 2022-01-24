import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card, autocompleteClasses, TextField, Button, IconButton, Menu, MenuItem, Modal, Divider } from "@mui/material";
import React, { Fragment, useCallback, useEffect, useReducer, useState } from "react";
import RuleSet from "../Game/RuleSet";
import SplitButton from "../Game/SplitButton";
import { styled } from '@mui/material/styles';
import Pink from "../Images/complex_logos.jpg"
import Green from "../Images/green.jpg"
import Character from "../Images/Sung-Gi-Hoon.jpg"
import { flexbox } from "@mui/system";
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import { AdminPanelSettings, ContentCopyOutlined, LockOpenTwoTone, LockTwoTone, LoyaltyRounded, SettingsBackupRestoreOutlined, VideogameAsset, VideogameAssetSharp } from "@mui/icons-material";
import QrCodeIcon from '@mui/icons-material/QrCode';
import VideogameAssetSharpIcon from '@mui/icons-material/VideogameAssetSharp';
import PeopleIcon from '@mui/icons-material/People';
import { Navigate, useNavigate } from "react-router";
import { isReturnStatement } from "typescript";
import MatchModal from "./MatchModal";
import Leaderboard from "../Leaderboard";
import AvatarModal from "./AvatarModal";
import InfoModal from "./InfoModal ";
import { api_req_init } from "../../ApiCalls/var";
import useFromApi from "../../ApiCalls/useFromApi";
import { AnyCnameRecord } from "node:dns";
import path from "path/posix";



const deepPink = "#ed1b76"
const lightPink = "#f44786"
const deepGreen = "#249f9c"
const lightGreen = "#037a76"
const backEndUrl = "http://127.0.0.1:3001"


const backGround = {
    layout: {
        backgroundImage: `url(` + `${Pink}` + ')',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh',
        display: "flex",
        overflow: "auto"
    },

    profile: {
        backgroundColor: deepGreen,
        backgroundOrigin: "center",
        backgroundPosition: 'center',
        marginTop: "100px",
        marginLeft: "5px",
        paddingRight: "5px",
        display: "flex",
        overflow: "hidden",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        // height: "65%",
        //   width: "95%"
    },

    firstRow: {
        color: "#FFFFFF",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyConten: "center",
        spacing: "2",
        paddingRight: "10px",
        paddingLeft: "10px",
        opacity: 1,
        borderRadius: "15px",
        //  height: "40%",
        overflow: "hidden"
    }
};

const content_1 = {
    position : "relative",
    backgroundColor: "rgba(0,0,0, 0.5)",
    color: "rgba(255,255,255,1)",
    minWidth: "15vw",
    width: "100%",
    marginRight: "5px",
    marginLeft: "5px",
    marginTop: '2px',
    marginBottom: '2px',
    paddingTop: "2px",
    paddingBottom: "2px",
    display: "grid",
    border: '1.5px solid purple',
    overflow: "scroll"
}


const content_2 = {
    backgroundColor: "rgba(0,0,0, 0.0)",
    marginRight: "5px",
    marginLeft: "5px",
    marginTop: '2px',
    marginBottom: '2px',
    paddingTop: "2px",
    paddingBottom: "2px",
    display: "grid",
    aligItems: "center",
    justifyContent: "center",

}

const searchBar = {
    positon: "relative",
    backgroundOrigin: "center",
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    display: "flex",
    marginRight: "5px",
    paddingLeft: "5px",
    paddingRight: '2px',
    marginBottom: '2px',
    paddingTop: "2px",
    paddingBottom: "2px",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "70%",
    minHeight: "10%",
}


const profileBlock = {
    positon: "relative",
    gridAutoFlow: "column",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    marginTop: '2px',
    marginBottom: '2px',
    paddingTop: "2px",
    paddingBottom: "2px",
    display: "grid",
    justifyContent: "space-evenly",
    alignItems: "center",
    minWidth: "100%",
    minHeight: "80%",
    border: '3px solid purple',

}

const matchHistory = {
    positon: "relative",
    backgroundOrigin: "center",
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    display: "flex",
    paddingRight: "2px",
    paddingLeft: "2px",
    marginTop: '2px',
    marginBottom: '2px',
    paddingTop: "2px",
    paddingBottom: "2px",
    //  justifyContent: "center",
    alignItems: "flex-start",
    minWidth: "70%",
    minHeight: "20%"
}


const container = {
    position: "relative",
    backgroundColor: "rgba(0, 0, 255, 0)", //BLEU
    minWidth: "98%",
    minHeight: "98%",
    marginLeft: "0",
    marginTop: "2%",
    paddingRight: "2px",
    paddingLeft: "2px",
    paddingTop: "2px",
    paddingBottom: "2px",
    display: "grid",
    // justifyContent: "center",
    alignItems: "center",
    // overflow: "auto"
}

const boxStyle = {
    position: "relative",
    backgroundColor: "rgba(255,0,0, 0.0)",
    backgroundPosition: 'center',
    //  marginTop: "100px",
    paddingTop: "15%",
    display: "flex",
    // marginRight: "12%",
    justifyContent: "center",
    alignItems: "center",
    height: "85%",
    width: "100%",
    overflow: "auto"
}

interface Iuser {
    id: number,
    id_pseudo: string,
    email: string,
    avatar: string,
    role: string,
    elo: number,
    status: string,
    two_factor: boolean,
    achievement1: boolean,
    achievement2: boolean
}

const defaultUser: Iuser = {
    id: 0,
    id_pseudo: "",
    email: "",
    avatar: "",
    role: "",
    elo: 0,
    status: "",
    two_factor: false,
    achievement1: false,
    achievement2: false,
}


function getAvatarFileName(backEndAvatarPath: string) {

    const avatarFileName = backEndAvatarPath.split("/").pop()
    console.log("avatar name: ", avatarFileName)
    return avatarFileName
}


export default function Profile() {

    const [isMount, setMount] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [modalState, setModal] = useState({
        match: false,
        info: false,
        avatar: false
    })
    const [update, setUpdate] = useState(0)
    const [userData, setUserData] = useState(defaultUser)

    const navigate = useNavigate()
    const open = Boolean(anchorEl);

    const getUserData = async () => {

        fetch(`${backEndUrl}/user`, {
            method: "GET",
            credentials: "include",
            referrerPolicy: "same-origin"
        })
            .then((res) => {
                if (res.status === 401) {
                    navigate("/login");
                }
                else if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then((resData) => {
                resData.avatar = getAvatarFileName(resData.avatar)
                return resData
            })
            .then((resData) => {
                resData.avatar = require("./../../frontAvatars/" + resData.avatar)
                setUserData(resData)
                console.log(userData)
            })
            .catch((err) => {
                console.log("Error caught: ", err)
            })
    }


    useEffect(() => {
        console.log("Profile re-renderer")
        getUserData()
    }, [update])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Fragment>

            <Paper style={backGround.layout}>
                <Toolbar />
                <Box sx={boxStyle}>
                    <Box sx={container}>
                        <Box sx={searchBar}>
                            <TextField fullWidth style={{
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: '1.8px solid purple',
                                borderRadius: "10px"
                            }} defaultValue={"Search for players"} >
                            </TextField>
                        </Box>

                        <Box sx={profileBlock}>
                            <Box sx={content_2}>
                                <Badge
                                    overlap="circular"
                                    badgeContent={userData.status}
                                    color="secondary"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                >
                                    <Avatar src={userData.avatar} style={{
                                        width: "125px",
                                        height: "125px",
                                        overflow: "hidden"
                                    }} />
                                </Badge>
                            </Box>
                            <Divider orientation="vertical" sx={{ height: "50%", backgroundColor: "rgba(191, 85, 236, 1)" }} />
                            <Box sx={content_1}>
                                <Typography sx={{
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    paddingLeft: "5%",
                                    paddingRight: "5%"
                                }}> {userData.id_pseudo}</Typography>

                                <Typography sx={{
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    paddingLeft: "5%",
                                    paddingRight: "5%"
                                }}> {userData.elo} </Typography>

                                <Typography sx={{
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    paddingLeft: "5%",
                                    paddingRight: "5%",
                                }}
                                >{userData.email}</Typography>
                            </Box>
                            <Divider orientation="vertical" sx={{
                                height: "50%",
                                backgroundColor: "rgba(191, 85, 236, 1)"
                            }} />
                            <Box sx={content_2}>
                                <Button
                                    id="basic-button"
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    style={{
                                        marginBottom: "10px",
                                    }}
                                >
                                    Edit
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={() => { setModal({ ...modalState, info: true }) }}>Infos</MenuItem>
                                    {modalState.info ? <InfoModal modalState={modalState.info} setModal={setModal} setUpdate={setUpdate} update={update} /> : null}
                                    <MenuItem onClick={() => { setModal({ ...modalState, avatar: true }) }}>Avatar</MenuItem>
                                    {modalState.avatar ? <AvatarModal setUpdate={setUpdate} update={update} modalState={modalState.avatar} setModal={setModal} /> : null}

                                </Menu>
                                <Button variant="contained" startIcon={userData.two_factor ? <LockTwoTone /> : <LockOpenTwoTone />} style={{
                                    marginTop: "10px",
                                }}>Auth {userData.two_factor ? "ON" : "OFF"}</Button>
                            </Box>
                        </Box>

                        <Box style={matchHistory}>
                            <Button variant="contained" onClick={() => { setModal({ ...modalState, match: true }) }} sx={{ width: "100%" }}> Match history </Button>
                            {modalState.match ? <MatchModal modalState={modalState.match} setModal={setModal} /> : null}
                        </Box>
                    </Box >
                </Box>
            </Paper >
        </Fragment >
    );

}


/* Solution numero 1 avec des grilles

                    <Grid container spacing={5} style={container}>
                        <Grid item xs={12} style={item}>
                            <Card style={content}>Test</Card>
                        </Grid>
                        <Grid item xs={12} style={item}>
                            <Box style={content}>Test</Box>

                        </Grid>
                        <Grid item xs={12} style={item}>
                            <Card style={content}>Test</Card>

                        </Grid>
                                            </Grid>
*/


/*

                <Grid container columns={13} spacing={3} style={backGround.profile}>

                    <Grid container item direction="column" justifyContent="flex-start" style={{
                        paddingLeft: "15px",
                        paddingRight: "15px"
                    }} >
                        <Grid item xs={12} >
                            <TextField fullWidth style={{
                                backgroundColor: "#FFFFFF",
                                opacity: 0.7,
                            }} defaultValue={"Search for players"} color="secondary">
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid container item xs={4} direction="column" style={backGround.firstRow}>
                        <Grid item xs={6}>
                            <Badge
                                overlap="circular"
                                badgeContent={userData.status}
                                color="secondary"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            >
                                <Avatar src={userData.avatar} style={{
                                    width: "120px",
                                    height: "120px",
                                }} />
                            </Badge>
                        </Grid>

                    </Grid>
                    <Grid container xs={5} direction="column" item style={backGround.firstRow}>
                        <Grid item>
                            <Typography variant="subtitle1" style={{
                                color: "#FFFFFF",
                                opacity: 1
                            }}> {userData.id_pseudo}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography> Rank: {userData.elo} </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography> Email: {userData.email}</Typography>
                        </Grid>

                    </Grid>
                    <Grid container item xs={3} direction="column" style={backGround.firstRow}>
                        <Grid item xs={4}>
                            <div>

                                <Button
                                    id="basic-button"
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    Edit
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >

                                    <MenuItem onClick={() => { setModal({ ...modalState, info: true }) }}>Infos</MenuItem>
                                    {modalState.info ? <InfoModal modalState={modalState.info} setModal={setModal} setUpdate={setUpdate} update={update} /> : null}
                                    <MenuItem onClick={() => { setModal({ ...modalState, avatar: true }) }}>Avatar</MenuItem>
                                    {modalState.avatar ? <AvatarModal setUpdate={setUpdate} update={update} modalState={modalState.avatar} setModal={setModal} /> : null}

                                </Menu>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" startIcon={<QrCodeIcon />}> Two factor </Button>
                        </Grid>
                    </Grid>

                </Grid>
                <Box>
                    <Button variant="contained" onClick={() => { setUpdate(update + 1) }setModal({ ...modalState, match: true })} > Match history </Button>
                    {modalState.match ? <MatchModal modalState={modalState.match} setModal={setModal} /> : null}
                </Box>
                */