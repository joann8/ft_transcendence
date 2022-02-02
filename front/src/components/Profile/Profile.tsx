import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card, autocompleteClasses, TextField, Button, IconButton, Menu, MenuItem, Modal, Divider } from "@mui/material";
import React, { Fragment, useCallback, useEffect, useReducer, useState } from "react";
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import { LockOpenTwoTone, LockTwoTone, LoyaltyRounded, NotificationAdd, SettingsBackupRestoreOutlined, VideogameAsset, VideogameAssetSharp } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import MatchModal from "./MatchModal";
import AvatarModal from "./AvatarModal";
import InfoModal from "./InfoModal ";
import profileStyle from './profileStyle'
import OtherUser from './OtherUser'
import { IUser } from "./profileStyle";
import FriendRequestModal from "./FriendRequestModal";
import LoadingModal from "./LoadingModal ";


const backEndUrl = "http://127.0.0.1:3001"


const defaultUser: IUser = {
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


    const [searchInput, setSearchInput] = useState("")
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [modalState, setModal] = useState({
        match: false,
        info: false,
        avatar: false,
        friend: false
    })
    const [ready, setReady] = useState(false)
    const [update, setUpdate] = useState(0)
    const [userData, setUserData] = useState(defaultUser)

    const open = Boolean(anchorEl);
    const navigate = useNavigate()

    const getUserData = async () => {
        await fetch(`${backEndUrl}/user`, {
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
                setUserData(resData)
                setReady(true)
                console.log("UserData : ", resData)
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

    const handleSearchBarSubmit = async (event) => {
        event.preventDefault()
        console.log("Profile User barSearch: ", searchInput)
        if (searchInput === userData.id_pseudo)
            navigate('/profile')
        else
            navigate(`/profile/${searchInput}`)
    }

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value)
    }

    const handleUpdateModal = () => {
        setUpdate(update + 1)
    }

    const handleCloseFriendModal = () => {
        setModal({ ...modalState, friend: false })
    }

    const intraImg = "https://cdn.intra.42.fr/users/medium_adconsta.jpg"

    if (ready) {
        return (
            <Fragment>
                <Paper sx={profileStyle.layout}>
                    <Toolbar />
                    <Box sx={profileStyle.boxStyle}>
                        <Box sx={profileStyle.container}>
                            <Box component="form" sx={profileStyle.searchBar} onSubmit={handleSearchBarSubmit}
                            >
                                <TextField fullWidth
                                    sx={{ input: { color: "purple" } }}
                                    style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                                        color: "rgba(255, 255, 255, 0.8)",
                                        border: '1px purple',
                                        borderRadius: "10px"
                                    }}
                                    label="Search for players"
                                    defaultValue={searchInput}
                                    onChange={handleSearchChange}
                                />
                            </Box>

                            <Box sx={profileStyle.profileBlock}>
                                <Box sx={profileStyle.content_2}>
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
                                <Box sx={profileStyle.content_1}>
                                    <Typography style={profileStyle.textBox} >{userData.id_pseudo}</Typography>
                                    <Typography style={profileStyle.textBox} >{userData.elo}</Typography>
                                    <Typography style={profileStyle.textBox} >{userData.email}</Typography>
                                </Box>
                                <Divider orientation="vertical" sx={{
                                    height: "50%",
                                    backgroundColor: "rgba(191, 85, 236, 1)"
                                }} />
                                <Box sx={profileStyle.content_2}>
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
                                        <Button onClick={() => { setModal({ ...modalState, info: true }) }}>Infos</Button>
                                        {modalState.info ? <InfoModal test={null /*modalState={modalState.info} setModal={setModal} setUpdate={setUpdate} update={update}*/} /> : null}
                                        <MenuItem onClick={() => { setModal({ ...modalState, avatar: true }) }}>Avatar</MenuItem>
                                        {modalState.avatar ? <AvatarModal setUpdate={setUpdate} update={update} modalState={modalState.avatar} setModal={setModal} /> : null}
                                    </Menu>
                                    <Button variant="contained"
                                        startIcon={<NotificationAddIcon color="error" />}
                                        onClick={() => { setModal({ ...modalState, friend: true }) }} >
                                        Friend Request
                                    </Button>
                                    {modalState.friend ? <FriendRequestModal user={userData} modalState={modalState.friend} setModal={setModal} update={update} setUpdate={setUpdate} /> : null}


                                    <Button variant="contained" startIcon={userData.two_factor ? <LockTwoTone /> : <LockOpenTwoTone />} style={{
                                        marginTop: "10px",
                                    }}>Auth {userData.two_factor ? "ON" : "OFF"}</Button>
                                </Box>
                            </Box>

                            <Box sx={profileStyle.matchHistory}>
                                <Button variant="contained" onClick={() => { setModal({ ...modalState, match: true }) }} sx={{ width: "100%" }}> Match history </Button>
                                {modalState.match ? <MatchModal modalState={modalState.match} setModal={setModal} /> : null}
                            </Box>
                        </Box >
                    </Box>
                </Paper >
            </Fragment >
        );
    }
    else {
        return (
            <LoadingModal />
        )
    }
}