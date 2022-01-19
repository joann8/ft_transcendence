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
import { AdminPanelSettings, SettingsBackupRestoreOutlined, VideogameAsset, VideogameAssetSharp } from "@mui/icons-material";
import QrCodeIcon from '@mui/icons-material/QrCode';
import VideogameAssetSharpIcon from '@mui/icons-material/VideogameAssetSharp';
import PeopleIcon from '@mui/icons-material/People';
import { Navigate, useNavigate } from "react-router";
import { isReturnStatement } from "typescript";
import MatchModal from "./MatchModal";
import Leaderboard from "../Leaderboard";
import Edit from "./Edit";

let user = {
    id: 0,
    id_pseudo: "",
    email: "",
    avatar: "",
    role: "",
    elo: 0,
    status: "",
    two_factor: false,
    achievement1: false,
    achievement2: false
}

const backEndUrl = "http://localhost:3001"

export default function Profile() {

    const [ready, setReady] = useState(false)
    const [error, setError] = useState(false)
    const [items, setItems] = useState(user)
    const [status, setStatus] = useState(0)

    const navigate = useNavigate()
    const deepPink = "#ed1b76"
    const lightPink = "#f44786"
    const deepGreen = "#249f9c"
    const lightGreen = "#037a76"

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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [modalState, setModal] = useState({
        match: false,
        infos: false,
        password: false,
        avatar: false
    })

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const boxTemplate = (
        <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
        </div>
    )

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
                        <Grid item xs={6}>   <Avatar src={Character} style={{
                            width: "120px",
                            height: "120px",
                        }} /> <br /></Grid>
                        <Grid item>

                            <Typography variant="subtitle1" style={{
                                color: "#FFFFFF",
                                opacity: 1
                            }}> 0123456789101112</Typography>
                        </Grid>
                    </Grid>
                    <Grid container xs={5} direction="column" item style={backGround.firstRow}>
                        <Grid item xs={4}>
                            <Typography> Telephone </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography> Email </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" onClick={() => setModal({...modalState, match : true})} > Match history </Button>
                            {modalState ? <MatchModal component={boxTemplate} modalState={modalState.match} setModal={setModal} /> : null}
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
                                    {/*
                                    <MenuItem onClick={() => {setEdit(1); setModal(true)}}>Infos</MenuItem>
                                    {modal && (edit === 1) ? <MatchModal component={<Edit/>} modal={modal} handleBox={handleBox} /> : null}
                                    <MenuItem onClick={() => onEdit(2)}>Password</MenuItem>
                                    {modal && (edit === 2) ? <MatchModal component={<Edit/>} modal={modal} handleBox={handleBox} /> : null}
                                    <MenuItem onClick={() => onEdit(3)}>Avatar</MenuItem>
                                    {modal && (edit === 3) ? <MatchModal component={<Leaderboard/>} modal={modal} handleBox={handleBox} /> : null}*/}

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
            const result = await fetch(`${backEndUrl}/user/adconsta`)
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