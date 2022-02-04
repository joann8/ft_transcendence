import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card, autocompleteClasses, TextField, Button, IconButton, Menu, MenuItem, Modal, Divider, backdropClasses, CircularProgress } from "@mui/material";
import React, { Fragment, useCallback, useEffect, useReducer, useState } from "react";
import Badge from '@mui/material/Badge';
import DoneIcon from '@mui/icons-material/Done';
import { Navigate, useNavigate, useParams } from "react-router";
import MatchModal from "./MatchModal";
import profileStyle, { IUser } from './profileStyle'
import LoadingGif from '../Images/loadingGif.gif'
import { LockOpenTwoTone, LockTwoTone, Pending, PersonAdd, PersonRemove, QuestionMark } from "@mui/icons-material";

const backEndUrl = "http://127.0.0.1:3001"

export default function OtherUser() {

    //Needs to be called on every render
    const params = useParams()
    const navigate = useNavigate()

    const [loaded, setLoaded] = useState(false)

    const [loggedInUserData, setLoggedInUserData] = useState(null)
    const [otherUserData, setOtherUserData] = useState(null)
    const [relation, setRelation] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [blocked, setBlocked] = useState(false)
    const [idPseudo, setIdPseudo] = useState(params.id_pseudo)
    const [modalState, setModal] = useState({
        match: false,
    })
    const [update, setUpdate] = useState(0)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


    //Optimiser les GET
    useEffect(() => {
        console.log("UseEffect : idPseudo: ", idPseudo)
        getAllInfo()
        //   setSearchInput("")
        console.log("Systematic Other Profile renderering")
    }, [idPseudo, update])




    //Function de fecthing
    const getOtherUserData = async (id_pseudo: string) => {
        const tmpOtherUserData = await fetch(`${backEndUrl}/user/${id_pseudo}`, {
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
                //alert(`Error while searching for user : [${err}]`)
            })
        console.log("Other User Data loaded : ", tmpOtherUserData)
        return tmpOtherUserData
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
                setLoggedInUserData(resData)
                return resData;
            })
            .catch((err) => {
                setLoggedInUserData(null)
                // alert(`Fetch : LoggedInUser : Error caught: ${err}`)
            })
        console.log("LoggedInUser Data loaded : ", userData)
        return userData
    }

    const getRelation = async (myPseudo : string ,otherUserPseudo: string) => {
        const relationData = await fetch(`${backEndUrl}/relation/one/${otherUserPseudo}`,
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
                    resData = ((myPseudo === resData.userId1.id_pseudo) ? resData.relation1 : resData.relation2)
                else
                    resData = 0
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
        const tmpUserData = await getUserData()
        console.log("OtherUser Data Fetching")

        const tmpOtherUserData = await getOtherUserData(idPseudo)
        setLoaded(true)
        if (!tmpUserData || !tmpOtherUserData)
            return;

        console.log("Relation Data Fetching")
        const relationData = await getRelation(tmpUserData.id_pseudo, tmpOtherUserData.id_pseudo)
    }

    const removeRelation = async (otherUserPseudo: string) => {
        const ret = await fetch(`${backEndUrl}/relation/remove`, {
            credentials: "include",
            referrerPolicy: "same-origin",
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                id_pseudo: otherUserPseudo
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

    const updateRelation = async (otherUserPseudo: string, newRelation1: number, newRelation2: number) => {
        const ret = await fetch(`${backEndUrl}/relation/update`, {
            credentials: "include",
            referrerPolicy: "same-origin",
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
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


    const handleSearchBarSubmit = (event) => {
        event.preventDefault()
        console.log("OtherUser barSearch : ", searchInput)
        if (searchInput === loggedInUserData.id_pseudo)
            navigate("/profile")
        else {
            navigate(`/profile/${searchInput}`)
            setIdPseudo(searchInput)
        }
    }

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value)
    }

    const handleBlocking = async (status) => {
        console.log("handleblocking : status : ", status)
        //if relation === 4 === click - demande de DEblocage === restart relation
        if (status === 4)
            await removeRelation(otherUserData.id_pseudo)
        else
            await updateRelation(otherUserData.id_pseudo, 4, 5)
        //if relation ==!4 - click ==== demande de blocage === update relation
        setUpdate(update + 1)
    }

    const handleAddFriend = async (status: number) => {
        //Add request
        if (status === 0)
            await updateRelation(otherUserData.id_pseudo, 1, 2)
        //Accept request
        else
            await updateRelation(otherUserData.id_pseudo, 3, 3)
        setUpdate(update + 1)
    }

    function BlockButton({ status }) {
        //4 bloque
        return (
            <Button
                id="basic-button"
                variant="contained"
                startIcon={status === 4 ? <LockOpenTwoTone /> : <LockTwoTone />}
                color="error"
                onClick={() => { handleBlocking(status) }}
                sx={{
                    marginTop: "10px",
                }}
            >
                {(status === 4) ? "Unblock" : "Block"}
            </Button>
        )
    }

    function AddFriendButton({ status }) {
        // 0 = NOT FRIENDS
        // 1 = SENT / Waiting
        // 2 = RECEIVED
        // 3 = FRIEND
        // 4 = BLOCK ACTIVE
        // if 2 --> Button devient Button menu pour unfriend
        if (status === 4)
            return (<div />)
        if (status === 3) {
            return (
                <Fragment>
                    <Button
                        variant="contained"
                        startIcon={<DoneIcon />}
                        style={{ marginBottom: "10px" }}
                    >
                        Friend
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={<PersonRemove />}
                        onClick={() => handleBlocking(4)}>
                        Remove
                    </Button>
                </Fragment>
            )
        }
        else {
            let addButton: string;
            if (status === 2)
                addButton = "Accept"
            else
                addButton = (status === 0 ? "Add" : "Waiting")
            return (
                <Button variant="contained"
                    disabled={status === 1 ? true : false}
                    style={{
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

    const test = true;

    // AJOUT JOANN TEST DEFY
   
     const onClickDefy = (challenger : IUser, challengee : IUser) => {
        //console.log(`${challenger.id_pseudo} is defying ${challengee.id_pseudo}`);
        //console.log(`challenger status : ${challenger.status}`);
        if (challenger.status === "IN GAME")
            alert("Your are already in a game");
        else if (challengee.status === "IN GAME") 
            alert(`${challengee.id_pseudo} is busy playing`);
        else if (challengee.status === "IN QUEUE")
            alert(`${challengee.id_pseudo} is already waiting for another player`);
        else if (challengee.status === "OFFLINE")
            alert(`${challengee.id_pseudo} is not connected`);
        else
            navigate(`/game/challenge/${challengee.id_pseudo}`);
    }

    const onClickWatch = (watcher : IUser, watchee : IUser) => {
        //console.log(`${watcher.id_pseudo} is watching ${watchee.id_pseudo}`);
        //console.log(`watchee status : ${watchee.status}`);
        if (watchee.status === "ONLINE" || watchee.status === "IN QUEUE")
            alert(`${watchee.id_pseudo} is not in a game at the moment`);
        else if (watchee.status === "OFFLINE")
            alert(`${watchee.id_pseudo} is not connected`);
        else
            navigate(`/game/watch/${watchee.id_pseudo}`);       
    }
    // FIN AJOUT JOANN
  


    //Render du Composant
    if (loaded === false) {
        return (
            <Fragment>
                <Toolbar />
                <Box style={{
                    position: "relative",
                    marginTop: "15%",
                    display: "flex",
                    width: "85%",
                    height: "70%",
                    justifyContent: "center",
                    alignContent: "center"
                }}>
                    <img src={LoadingGif} alt="Loading the page" style={{
                        borderRadius: "50%"
                    }} />
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
                                    <Typography style={profileStyle.textBox}> Sorry, there is no player with pseudo : [{idPseudo}] </Typography>
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
                                    {/* START ____ Ajout Joann pour tester defi */}
                                    <Button variant="contained" onClick={() => onClickDefy(loggedInUserData, otherUserData)}> DEFY </Button>
                                    <Button variant="contained" onClick={() => onClickWatch(loggedInUserData, otherUserData)}> Watch </Button>
                                    {/* END ___Ajout Joann pour tester defi */}
                                </Box>
                                <Divider orientation="vertical" sx={{ height: "50%", backgroundColor: "rgba(191, 85, 236, 1)" }} />
                                <Box sx={profileStyle.content_1}>
                                    <Typography style={profileStyle.textBox}> {otherUserData.id_pseudo}</Typography>
                                    <Typography style={profileStyle.textBox}> {otherUserData.elo} </Typography>
                                    <Typography style={profileStyle.textBox}>{otherUserData.email}</Typography>
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