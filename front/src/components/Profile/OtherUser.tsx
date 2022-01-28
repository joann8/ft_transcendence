import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card, autocompleteClasses, TextField, Button, IconButton, Menu, MenuItem, Modal, Divider, backdropClasses } from "@mui/material";
import React, { Fragment, useCallback, useEffect, useReducer, useState } from "react";
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import { Navigate, useNavigate, useParams } from "react-router";
import MatchModal from "./MatchModal";
import profileStyle from './profileStyle'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import LoadingGif from '../Images/loadingGif.gif'
import { IRelation, IUser } from "./profileStyle";
import { updateExportDeclaration } from "typescript";
import { LockOpenTwoTone, LockTwoTone, Pending, PersonAdd } from "@mui/icons-material";
import { color, style } from "@mui/system";

const backEndUrl = "http://127.0.0.1:3001"

export default function OtherUser() {

    const navigate = useNavigate()
    const params = useParams()

    const [loaded, setLoaded] = useState(false)

    const [loggedInUserData, setLoggedInUserData] = useState(null)
    const [otherUserData, setOtherUserData] = useState(null)
    const [relation, setRelation] = useState(null)
    /*Relation code 
     0 : Absence 
     1 : Demande attente : envoyeur
     2 : Demande attende : receveur
     3 : Amis
     4 : Blocage actif
     5 : Blocage passif 
     */
    const [searchInput, setSearchInput] = useState("")
    const [blocked, setBlocked] = useState(false)
    const [idPseudo, setIdPseudo] = useState(params.id_pseudo)
    const [modalState, setModal] = useState({
        match: false,
    })
    const [update, setUpdate] = useState(0)


    const getOtherUserData = async (id_pseudo: string) => {
        const localOtherUserData = await fetch(`${backEndUrl}/user/${id_pseudo}`, {
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
                setOtherUserData(resData)
                return resData
            })
            .catch((err) => {
                setOtherUserData(null)
                alert(`Error while searching for user : [${err}]`)
            })
        console.log("Other User Data loaded : ", localOtherUserData)
        return localOtherUserData
    }

    const getUserData = async () => {
        const userData = await fetch(`${backEndUrl}/user`, {
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
                console.log("LoggedInUser Data loaded READY for real: ", resData)
                setLoggedInUserData(resData)
                return resData;
            })
            .catch((err) => {
                setLoggedInUserData(null)
                alert(`Fetch : LoggedInUser : Error caught: ${err}`)
            })
        console.log("LoggedInUser Data loaded : ", userData)
        return userData
    }

    const getRelation = async (myUserPseudo: string, otherUserPseudo: string) => {
        const relationData = await fetch(`${backEndUrl}/relation/${myUserPseudo}/${otherUserPseudo}`,
            {
                credentials: "include",
                referrerPolicy: "same-origin",
                method: "GET",
            }
        ).then((res) => {
            console.log("getRelation res:", res)
            if (res.status === 401)
                navigate("/login")
            else if (!res.ok) {
                throw new Error(res.statusText)
            }
            if (res.status === 204)
                return (0)
            else
                return res.json()
        })
            .then((resData) => {
                console.log("getRelation raw data : ", resData)
                //ResData = Relation
                //Cherche la bonne relation dans la bonne case
                if (resData)
                    resData = ((myUserPseudo === resData.userId1.id_pseudo) ? resData.relation1 : resData.relation2)
                else
                    resData = 0
                //resData -  0 - Pas de relation
                //resData [1 - 5] - relation existe 
                setRelation(resData)
                return resData;
            })
            .catch((err) => {
                alert(`GetRelation : Error : ${err}`)
            })
        console.log("Relation loaded : ", relationData)
        return (relationData)
    }

    const getAllInfo = async () => {
        console.log("User Data Fetching")
        const userData = await getUserData()
        console.log("OtherUser Data Fetching")

        const localOtherUserData = await getOtherUserData(idPseudo)
        console.log("Relation Data Fetching")
        if (!userData || !localOtherUserData)
            return alert("UserData or OtherUserData Fetch has gone wrong")
        const relationData = await getRelation(userData.id_pseudo, localOtherUserData.id_pseudo)
        setLoaded(true)
    }


    //Optimiser les GET
    useEffect(() => {
        console.log("idPseudo: ", idPseudo)
        getAllInfo()
        console.log("Systematic Other Profile renderering")
    }, [idPseudo, update])


    const handleSearchBarSubmit = (event) => {
        event.preventDefault()
        console.log("Other User search : ", searchInput)
        if (searchInput === loggedInUserData.id_pseudo)
            navigate("/profile")
        else {
            navigate(`/profile/${searchInput}`)
            setIdPseudo(searchInput)
        }
        //navigate(`/profile/${searchInput}`)
    }

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value)
    }

    const removeRelation = async (myUserPseudo: string, otherUserPseudo: string) => {
        const ret = await fetch(`${backEndUrl}/relation/remove`, {
            credentials: "include",
            referrerPolicy: "same-origin",
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                id_pseudo1: myUserPseudo,
                id_pseudo2: otherUserPseudo
            })
        })
            .then(res => {
                if (res.status === 401)
                    navigate('/login')
                else if (!res.ok)
                    throw new Error(res.statusText)
                else
                    return true
            })
            .catch((err) => {
                alert(`removeRelation : Error : ${err}`)
                return false
            })
        return ret
    }

    const updateRelation = async (myUserPseudo: string, otherUserPseudo: string, newRelation1: number, newRelation2: number) => {
        const ret = await fetch(`${backEndUrl}/relation/update`, {
            credentials: "include",
            referrerPolicy: "same-origin",
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                id_pseudo1: myUserPseudo,
                id_pseudo2: otherUserPseudo,
                relation1: newRelation1,
                relation2: newRelation2
            })
        })
            .then(res => {
                if (res.status === 401)
                    navigate('/login')
                else if (!res.ok)
                    throw new Error(res.statusText)
                else
                    return true
            })
            .catch((err) => {
                alert(`updateRelation: ${err}`)
                return false
            })
        return ret
    }



    const handleBlocking = async (status) => {
        console.log("handleblocking : status : ", status)
        //if relation === 4 === click - demande de DEblocage === restart relation
        if (status === 4)
            await removeRelation(loggedInUserData.id_pseudo, otherUserData.id_pseudo)
        else
            await updateRelation(loggedInUserData.id_pseudo, otherUserData.id_pseudo, 4, 5)
        //if relation ==!4 - click ==== demande de blocage === update relation
        setUpdate(update + 1)
    }

    function BlockButton({ status }) {
        //4 bloque
        return (
            <Button
                id="basic-button"
                variant="contained"
                startIcon={ status === 4 ? <LockOpenTwoTone/> : <LockTwoTone/>}
                color={(status === 4) ? "secondary" : "error"}
                onClick={() => { handleBlocking(status) }}
                style={{
                    marginBottom: "10px",
                }}
            >
                {(status === 4) ? "Unblock" : "Block"}
            </Button>
        )
    }

    function AddFriendButton({ status }) {
        // 0 = NOT FRIENDS
        // 1 = SENT
        // 2 = RECEIVED
        // 3 = FRIEND
        // 4 = BLOCK ACTIVE
        // if 2 --> Button devient Button menu pour unfriend
        if (status === 4)
            return (<div />)

        if (status === 3) {
            return (
                <Button variant="contained">
                    Friend
                </Button>
            )
        }
        else {

            return (
                <Button variant="contained" startIcon={ status === 0 ? <PersonAdd/> : <Pending/>}                >
                    {status === 0 ? "Add" : "Waiting "}
                </Button>
            )
        }
    }

    if (loaded === false) {
        return (<Fragment>
            <Toolbar />
            <Box sx={{
                height: "70vh",
                widht: "70vw"
            }}>
                <h1> Loading </h1>
            </Box>
        </Fragment>
        )
    }
    //Affichage :  USER DOES NOT EXIST
    //Soit il existe pas soit il m'a bloque
    if (relation === 5 || otherUserData === null) {
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
                                        badgeContent={otherUserData.status}
                                        color="secondary"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    >
                                        <Avatar src={otherUserData.avatar} style={{
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
                                    }}> {otherUserData.id_pseudo}</Typography>

                                    <Typography sx={{
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                        paddingLeft: "5%",
                                        paddingRight: "5%"
                                    }}> {otherUserData.elo} </Typography>

                                    <Typography sx={{
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                        paddingLeft: "5%",
                                        paddingRight: "5%",
                                    }}
                                    >{otherUserData.email}</Typography>
                                </Box>
                                <Divider orientation="vertical" sx={{
                                    height: "50%",
                                    backgroundColor: "rgba(191, 85, 236, 1)"
                                }} />

                                <Box sx={profileStyle.content_2}>
                                    <AddFriendButton status={relation} />
                                    <BlockButton status={relation} />

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
                                badgeContent={otherUserData.status}
                                color="secondary"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            >
                                <Avatar src={otherUserData.avatar} style={{
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
                            }}> {otherUserData.id_pseudo}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography> Rank: {otherUserData.elo} </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography> Email: {otherUserData.email}</Typography>
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