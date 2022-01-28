import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card, autocompleteClasses, TextField, Button, IconButton, Menu, MenuItem, Modal, Divider } from "@mui/material";
import React, { Fragment, useCallback, useEffect, useReducer, useState } from "react";
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import { LockOpenTwoTone, LockTwoTone, LoyaltyRounded, SettingsBackupRestoreOutlined, VideogameAsset, VideogameAssetSharp } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router";
import MatchModal from "./MatchModal";
import AvatarModal from "./AvatarModal";
import InfoModal from "./InfoModal ";
import profileStyle from './profileStyle'
import OtherUser from './OtherUser'
import { IUser } from "./profileStyle";


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


    const [otherUserData, setOtherUserData] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [modalState, setModal] = useState({
        match: false,
        info: false,
        avatar: false
    })
    const [update, setUpdate] = useState(0)
    const [userData, setUserData] = useState(defaultUser)

    const open = Boolean(anchorEl);
    const navigate = useNavigate()

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
                setUserData(resData)
                console.log("UserData : ", resData)
            })
            .catch((err) => {
                console.log("Error caught: ", err)
            })
    }


    const getOtherUserData = async (id_pseudo: string) => {
        fetch(`${backEndUrl}/user/${id_pseudo}`, {
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
                alert(`User [${resData.id_pseudo}] was found`)
                console.log("OtherUser found Data : ", resData)
                setOtherUserData(resData)
            })
            .catch((err) => {
                alert(`Error while searching for user : [${err}]`)
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
        console.log("Logged in User search: ", searchInput )
        if (searchInput === userData.id_pseudo)
            navigate('/profile')
        else
            navigate(`/profile/${searchInput}`)
       // await getOtherUserData(searchInput)
       // alert(`search for [${searchInput}] profile`)
    }

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value)
    }

    const intraImg = "https://cdn.intra.42.fr/users/medium_adconsta.jpg"

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