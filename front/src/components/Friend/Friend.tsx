
import { Grid, Paper, Toolbar } from "@mui/material"
import React, { Fragment } from "react"
import FriendList from "./FriendList"
import friendBg from "../Images/friendBg.jpeg"




const layout = {
    backgroundImage: `url(` + `${friendBg}` + ')',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
    backgroundSize: 'cover',
    width: '100vw',
    height: '100vh',
    overflow: "auto"
}

const style = {
    position: 'relative',
    top: '55%',
    left: '55%',
    maxHeight: "40vh",
    maxWidth: "50vw",
    transform: 'translate(-50%, -50%)',
    bgcolor: 'rgba(250, 250, 250)',
    border: '2px solid #000',
    display: "flex",
    p: 4,
};

const boxWrapper = {
    position: "relative",
    // transform: 'translate(-50%, -50%)',
    top: "20%",
    margin: "auto",
    maxWidth: "900px",
    maxHeight: "80vh",
    overflow: "auto"
}


export default function Friend() {

    return (
        <Fragment>
            <Paper style={layout}>
                <Toolbar />
                <Grid container spacing={2} sx={boxWrapper}>
                    <Grid item xs={2} />
                    <Grid item xs={8} alignItems="center">
                        <FriendList />
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </Paper>
        </Fragment>
    )
}