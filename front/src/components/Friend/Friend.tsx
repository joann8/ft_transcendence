
import { Box, Grid, Paper, Toolbar } from "@mui/material"
import React, { Fragment } from "react"
import FriendList from "./FriendList"
import friend from "../Images/friends.jpg"


const layout = {
    backgroundImage: `url(` + `${friend}` + ')',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
    backgroundSize: 'cover',
    width: '100vw',
    height: '100vh',
    display: "flex",
    overflow: "auto"
}

export default function Friend() {
    return (
        <Fragment>
            <Paper style={layout}>
                <Toolbar />

                <Grid container spacing={2} alignItems="center" justifyContent="center" style={{
                    height: "100vh"
                }}>
                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        <FriendList />
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </Paper>
        </Fragment>
    )
}