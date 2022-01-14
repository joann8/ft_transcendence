import { Toolbar, Grid, Paper, Avatar, Container, CssBaseline, Box, Typography, Card } from "@mui/material";
import React, { Fragment, useEffect, useReducer, useState } from "react";
import RuleSet from "../Game/RuleSet";
import SplitButton from "../Game/SplitButton";
import { styled } from '@mui/material/styles';
import Pink from "../Images/pink.jpeg"
import Green from "../Images/green.jpg"
import Character from "../Images/Sung-Gi-Hoon.jpg"

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
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const backEndUrl = "http://localhost:3001"

export default function Profile() {

    const [ready, setReady] = useState(false)
    const [error, setError] = useState(false)
    const [items, setItems] = useState(user)
    const [status, setStatus] = useState(0)

    const pageBackground = {
        backgroundImage: {
            backgroundImage: `url(` + `${Pink}` + ')',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
            overflow: 'auto',
        }
    };

    const profileBackground = {
        backgroundImage: {
            backgroundImage: `url(` + `${Green}` + ')',
        }
    };

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
    /*
        id: = { items.id }.< br />
            id_pseudo: { items.id_pseudo }.<br />
        email: { items.email }.<br />
        avatar: { items.avatar } <br />
        role: { items.role }.<br />
        elo: { items.elo }.<br />
        status: { items.status }.<br />
        two_factor: { items.two_factor }.<br />
        achievement1: { items.achievement1 }.<br />
        achievement2: { items.achievement2 }.<br />
    */
    return (
        <Fragment>
            <Paper style={pageBackground.backgroundImage}>
                    <Grid spacing={1} container alignItems="center" justifyContent="center" style={{ height: "100vh", width: "100vw" }}>
                        <Paper style={profileBackground.backgroundImage}>
                            <Grid container position="fixed" direction="row" spacing={3} justifyContent="flex-start" style={{ height: "30vh", width: "50vw" }}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <Avatar src={Character} />
                                </Grid>
                                <Grid item>
                                    user Info
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
            </Paper>
        </Fragment >
    );
    /*
return (
    <Fragment>
        <Box sx={{ width: 1}}>
        <Container maxWidth="sm">
        <Paper elevation={16}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item md>
                    <h1 >
                        <div>
                            {!ready ? "Loading..." : <Avatar alt="Remy Sharp" src={characterImg} />}
                        </div>
                    </h1>
                </Grid>
                <Grid item xs>
                    <h1>
                        user infos
                    </h1>
                </Grid>
            </Grid>
        </Paper>
        </Container>
    </Box>
    </Fragment >
)
*/
}