import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card, autocompleteClasses, TextField, Button, IconButton } from "@mui/material";
import React, { Fragment, useEffect, useReducer, useState } from "react";
import RuleSet from "../Game/RuleSet";
import SplitButton from "../Game/SplitButton";
import { styled } from '@mui/material/styles';
import Pink from "../Images/pink.jpeg"
import Green from "../Images/green.jpg"
import Character from "../Images/Sung-Gi-Hoon.jpg"
import { flexbox } from "@mui/system";
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import { AdminPanelSettings, VideogameAsset, VideogameAssetSharp } from "@mui/icons-material";
import QrCodeIcon from '@mui/icons-material/QrCode';
import VideogameAssetSharpIcon from '@mui/icons-material/VideogameAssetSharp';

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
            justifyContent: "center",
            alignItem: "center"
        },
        profile: {
            backgroundOrigin: "center",
            backgroundPosition: 'center',
            marginTop: "150px",
            marginLeft: "5px",
            paddingRight: "5px",
            display: "flex",
            overflow: "hidden",
            justifyContent: "space-between",
            alignItems: "flex-start",
            height: "65%",
            width: "95%"
        },

        firstRow: {
            backgroundColor: deepGreen,
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

    return (
        <Fragment>
            <Paper style={backGround.layout}>

                <Grid container columns={13} spacing={3} style={backGround.profile}>
                    <Grid container item xs={4} direction="column" style={backGround.firstRow}>
                        <Grid item xs={6}>   <Avatar src={Character} style={{
                            width: "120px",
                            height: "120px",
                        }} /> <br /></Grid>
                        <Grid item>
                            <Typography variant="subtitle1" style={{
                            }}> 0123456789101112</Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="column" item xs={5} style={backGround.firstRow}>
                        <Grid item xs={4}>
                            <Typography> Telephone </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography> Email </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" > Match history </Button>
                        </Grid>
                    </Grid>
                    <Grid container item xs={3} direction="column" style={backGround.firstRow}>
                        <Grid item xs={3}>
                            <Button variant="contained" startIcon={<EditIcon />}> Edit </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" startIcon={<AdminPanelSettings />}> Admin </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" startIcon={<QrCodeIcon />}> Two factor </Button>
                        </Grid>
                    </Grid>
                    <Grid container item direction="column" justifyContent="flex-start">
                        <Grid item xs={12} >
                            <TextField fullWidth style={{
                            backgroundColor: "#FFFFFF",
                            opacity: 0.7
                        }} label="Search for players" color="secondary">
                            </TextField>
                        </Grid>

                    </Grid>
                </Grid>
            </Paper >
        </Fragment >
    );
}

/*
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