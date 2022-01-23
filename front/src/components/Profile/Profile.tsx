import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card, autocompleteClasses, TextField, Button, IconButton, Menu, MenuItem, Modal } from "@mui/material";
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
import { AdminPanelSettings, LoyaltyRounded, SettingsBackupRestoreOutlined, VideogameAsset, VideogameAssetSharp } from "@mui/icons-material";
import QrCodeIcon from '@mui/icons-material/QrCode';
import VideogameAssetSharpIcon from '@mui/icons-material/VideogameAssetSharp';
import PeopleIcon from '@mui/icons-material/People';
import { Navigate, useNavigate } from "react-router";
import { isReturnStatement } from "typescript";
import MatchModal from "./MatchModal";
import Leaderboard from "../Leaderboard";
import Edit from "./Edit";
import AvatarModal from "./AvatarModal";
import InfoModal from "./InfoModal ";
import { api_req_init } from "../../ApiCalls/var";
import useFromApi from "../../ApiCalls/useFromApi";



const FRONT_AVATAR_URL = "./../../frontAvatars/"

const FULL_PATH = "/home/calao/Documents/42/42cursus/ft_transcendence/front/src/frontAvatars/"
const backGround = {

    layout: {
        //backgroundColor: "#555555",
        backgroundImage: `url(` + `${Pink}` + ')',
        backgroundOrigin: "bottom",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh',
        display: "flex",
     /*   justifyContent: "center",
        alignItem: "center"
    */},
    profile: {
        backgroundOrigin: "center",
        backgroundPosition: 'center',
        marginTop: "100px",
        marginLeft: "5px",
        paddingRight: "5px",
        display: "flex",
        overflow: "hidden",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        height: "65%",
        width: "95%"
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
        height: "40%",
        overflow: "hidden"
    }
};

const defaultUser = {
    id: 0,
    id_pseudo: "Seong Gi-Hun",
    email: "Seaong@squid-game.io",
    avatar: `${Character}`,
    avatarFileName: "",
    role: "NONE",
    elo: 1000,
    status: "Online",
    two_factor: false,
    achievement1: false,
    achievement2: false
}

const deepPink = "#ed1b76"
const lightPink = "#f44786"
const deepGreen = "#249f9c"
const lightGreen = "#037a76"


const backEndUrl = "http://127.0.0.1:3001"

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


    const getUserData = async () => {

        fetch(`${backEndUrl}/user`, {
            method: "GET",
            credentials: "include",
            referrerPolicy: "same-origin"
        })
            .then((res) => {
                if (res.status === 401) {
                    // console.log("redirection Login")
                    navigate("/login");
                }
                else if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then((resData) => {
                let avatarPath = resData.avatar
                const avatarFileName = avatarPath.split("/").pop()

                resData.avatar = require(`./../../frontAvatars/${avatarFileName}`)
                // require("./../../frontAvatars/" + totoro)
                setUserData(resData)

            })
            .catch((err) => {
                console.log("Error caught: ", err)
                //Get User infos
            })
    }

    const tmp = "../Images/Sung-Gi-Hoon.jpg"


    useEffect(() => {
        console.log("Current userData:", userData)
    })
    useEffect(() => {

        console.log("Profile re-renderer")
        getUserData()
    }, [update])

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    return (
        <Fragment>

            <Paper style={backGround.layout}>

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
                        <Grid item xs={6}>   <Avatar src={userData.avatar} style={{
                            width: "120px",
                            height: "120px",
                        }} /> <br /></Grid>
                        <Grid item>

                            <Typography variant="subtitle1" style={{
                                color: "#FFFFFF",
                                opacity: 1
                            }}> {userData.id_pseudo}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container xs={5} direction="column" item style={backGround.firstRow}>
                        <Grid item xs={4}>
                            <Typography> Rank: {userData.elo} </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography> Email: {userData.email}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" onClick={() => { setUpdate(update + 1) }/*setModal({ ...modalState, match: true })*/} > Match history </Button>
                            {modalState.match ? <MatchModal modalState={modalState.match} setModal={setModal} /> : null}
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
                                    {modalState.avatar ? <AvatarModal modalState={modalState.avatar} setModal={setModal} /> : null}

                                </Menu>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" startIcon={<PeopleIcon />}> Friends </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" startIcon={<QrCodeIcon />}> Two factor </Button>
                        </Grid>
                    </Grid>

                </Grid>
            </Paper >
        </Fragment >
    );

}

/*
                            <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}> Edit </Button>

 <Box  style={{
                    backgroundColor : "#ea3002",
                    marginTop: "15%",
                    marginRight: "5%",
                    marginLeft: "5%",
                    marginBottom: "5%"
                }}>
                    <Grid container >
                        <Grid item xs={7}  style={{
                            backgroundColor: deepGreen,
                        }}>
                            <Avatar />
                            <Button variant="contained" startIcon={<EditIcon />}> Edit </Button>
                            <Button variant="contained" startIcon={<AdminPanelSettings />}> Admin </Button>
                            <Button variant="contained" startIcon={<QrCodeIcon />}> Enable two factor </Button>
                        </Grid>
                        <Grid item xs={2} style={{
                            backgroundColor: "#000000"
                        }}>

                        </Grid>
                    </Grid>
                </Box>






   useEffect(() => {
        const fetchData = async () => {
            let status: number;
            const result = await fetch(`${backEndUrl}/data/adconsta`)
                .then(function (response) {
                    status = response.status
                    response.json()
                        .then(function (parsedJson) {
                            setItems(parsedJson)
                            setStatus(status)
                            setReady(true)
                        })
                })
        }
        fetchData();
    }, [])
    */