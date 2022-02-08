import { Toolbar, Paper, Avatar, Box, Typography, TextField, Button, Divider, Chip } from "@mui/material";
import React, { Fragment, useContext, useEffect, useState } from "react";
import Badge from '@mui/material/Badge';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate, useParams } from "react-router";
import MatchModal from "./MatchModal";
import profileStyle from './profileStyle'
import { LockOpenTwoTone, LockTwoTone, Pending, PersonAdd, PersonRemove, QuestionMark } from "@mui/icons-material";
import { Context } from "../MainCompo/SideBars";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarsIcon from '@mui/icons-material/Stars';

const backEndUrl = "http://127.0.0.1:3001"

export default function OtherUser() {

    //Needs to be called on every render
    const params = useParams()
    const navigate = useNavigate()
    const context = useContext(Context)


    const [loaded, setLoaded] = useState(false)
    const [otherUserData, setOtherUserData] = useState(null)
    const [relation, setRelation] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [idPseudo, setIdPseudo] = useState(params.id_pseudo)
    const [modalState, setModal] = useState({
        match: false,
    })
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        getAllInfo()
    }, [idPseudo, update, context.user])

    const getAllInfo = async () => {
        const tmpOtherUserData = await getOtherUserData(idPseudo)
        if (!tmpOtherUserData)
            return;
        await getRelation(context.user.id_pseudo, tmpOtherUserData.id_pseudo)
    }

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
        setLoaded(true)
        return tmpOtherUserData
    }

    const getRelation = async (myPseudo: string, otherUserPseudo: string) => {
        const relationData = await fetch(`${backEndUrl}/relation/one/${otherUserPseudo}`,
            {
                credentials: "include",
                referrerPolicy: "same-origin",
                method: "GET",
            }
        ).then((res) => {
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
        return (relationData)
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

    //Change l'URL et update le profile a charger
    const handleSearchBarSubmit = (event) => {
        event.preventDefault()
        navigate(`/profile/${searchInput}`)
        setIdPseudo(searchInput)
        setUpdate(!update)
    }

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value)
    }

    const handleBlocking = async (status) => {
        if (status === 4)
            await removeRelation(otherUserData.id_pseudo)
        else
            await updateRelation(otherUserData.id_pseudo, 4, 5)
        setUpdate(!update)
    }

    const handleAddFriend = async (status: number) => {
        if (status === 0)
            await updateRelation(otherUserData.id_pseudo, 1, 2)
        else
            await updateRelation(otherUserData.id_pseudo, 3, 3)
        setUpdate(!update)
    }

    function FriendBlockButton({ status }) {
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

    function ButtonBlock({ status }) {
        return (
            <Fragment>
                { otherUserData.achievement1 ? <Chip icon={<StarsIcon />} label="Win with Max Score (3-0)" color="success" /> :  <Chip icon={<StarsIcon />} label="Win with Max Score (3-0)" variant="outlined" color="secondary" /> }
                <br/>
                { otherUserData.achievement2 ? <Chip icon={<EmojiEventsIcon />} label="Win 3 times" color="success" /> : <Chip icon={<EmojiEventsIcon />} label="Win 3 times" variant="outlined" color="secondary" /> }
                {idPseudo !== context.user.id_pseudo && <FriendBlockButton status={relation} />}
            </Fragment>
        )
    }

    //LOADING
    if (loaded === false) {
        return (
            <Fragment>
            </Fragment>
        )
    }
    //USER INEXISTENT or BLOCKED
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
    //Render OTHERUSER PROFILE
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
                                    <Typography style={profileStyle.textBox}> {otherUserData.id_pseudo}</Typography>
                                    <Typography style={profileStyle.textBox}> {otherUserData.elo} </Typography>
                                    <Typography style={profileStyle.textBox}>{otherUserData.email}</Typography>
                                </Box>
                                <Divider orientation="vertical" sx={{
                                    height: "50%",
                                    backgroundColor: "rgba(191, 85, 236, 1)"
                                }} />

                                <Box sx={profileStyle.content_2}>
                                    <ButtonBlock status={relation} />
                                </Box>
                            </Box>

                            <Box sx={profileStyle.matchHistory}>
                                <Button variant="contained" onClick={() => { setModal({ ...modalState, match: true }) }} sx={{ width: "100%" }}> Match history </Button>
                                {modalState.match ? <MatchModal modalState={modalState.match} setModal={setModal} user={otherUserData}/> : null}
                            </Box>
                        </Box >
                    </Box>
                </Paper >
            </Fragment >
        );
    }
}