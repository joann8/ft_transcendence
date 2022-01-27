import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card, autocompleteClasses, TextField, Button, IconButton, Menu, MenuItem, Modal, Divider } from "@mui/material";
import React, { Fragment, useCallback, useEffect, useReducer, useState } from "react";
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import { Navigate, useNavigate, useParams } from "react-router";
import MatchModal from "./MatchModal";
import profileStyle from './profileStyle'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import LoadingGif from '../Images/loadingGif.gif'

const backEndUrl = "http://127.0.0.1:3001"


export default function OtherUser() {

    const navigate = useNavigate()
    const params = useParams()
 
    const [loaded, setLoaded] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [blocked, setBlocked] = useState(false)
    const [idPseudo, setIdPseudo] = useState(params.id_pseudo)
    const [modalState, setModal] = useState({
        match: false,
    })

    const [userData, setUserData] = useState(null)
    const [friendStatus, setfriendStatus] = useState(0)

  
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
                //  alert(`User [${resData.id_pseudo}] was found`)
                console.log("OtherUser found Data : ", resData)
                setUserData(resData)
                setLoaded(true)
            })
            .catch((err) => {
                setLoaded(true)
                setUserData(null)
                alert(`Error while searching for user : [${err}]`)
                console.log("Error caught: ", err)
            })
    }

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
                setLoggedInUser(resData)
                console.log("UserData : ", resData)
            })
            .catch((err) => {
                console.log("Error caught: ", err)
            })
    }

    useEffect (() => {
        getUserData()
    }, [])

    useEffect(() => {
        console.log("idPseudo: ", idPseudo)
        getOtherUserData(idPseudo)
        console.log("Systematic Other Profile renderering")
    }, [idPseudo])

    const handleSearchBarSubmit = (event) => {
        event.preventDefault()
        console.log("Other User search : ", searchInput)
        if (searchInput === loggedInUser.id_pseudo)
            navigate("/profile")
        else
        {
            navigate(`/profile/${searchInput}`)
            setIdPseudo(searchInput)
        }
        //navigate(`/profile/${searchInput}`)
    }

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value)
    }

    const handleBlocking = () => {
        const newBlockVal = !blocked
        setBlocked(newBlockVal)
    }

    function PlayButton({ active }) {
        return (
            <Button disabled={active} startIcon={<VideogameAssetIcon />} variant="contained" style={{
                marginTop: "10px",
            }}> Play </Button>
        )
    }

    function AddFriendButton({ status }) {
        // 0 = Not Friend
        // 1 = Waiting
        // 2 = Friend 
        // if 2 --> Button devient Button menu pour unfriend
        if (status == 2) {
            return (
                <Button variant="contained">
                    Friend
                </Button>
            )
        }
        else {
            return (
                <Button disabled={status ? true : false} variant="contained">
                    {status ? "Waiting" : "Add"}
                </Button>
            )
        }
    }


    if (!loaded || loggedInUser === null ) {
        return (<Fragment>
            <Toolbar />
            <Box>
                <h1> Loading </h1>
            </Box>
        </Fragment>
        )
    }
    if (loaded && userData === null) {
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
                                <Divider orientation="vertical" sx={{ height: "50%", backgroundColor: "rgba(191, 85, 236, 1)" }} />
                                <Box sx={profileStyle.content_1}>
                                    <Typography sx={{
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                        paddingLeft: "5%",
                                        paddingRight: "5%"
                                    }}> No player found with name {idPseudo} </Typography>
                                </Box>
                                <Divider orientation="vertical" sx={{
                                    height: "50%",
                                    backgroundColor: "rgba(191, 85, 236, 1)"
                                }} />
                            </Box>
                        </Box >
                    </Box>
                </Paper >
            </Fragment >
        )
    }
    else {
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
                                        color={blocked ? "error" : "secondary"}
                                        onClick={handleBlocking}
                                        style={{
                                            marginBottom: "10px",
                                        }}
                                    >
                                        {blocked ? "Unblock" : "Block"}
                                    </Button>
                                    {userData.status === "ONLINE" ? <PlayButton active={true} /> : <PlayButton active={false} />}
                                    <AddFriendButton status={friendStatus} />
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