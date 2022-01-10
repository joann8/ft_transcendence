import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Route, Routes, Link, BrowserRouter as Router } from "react-router-dom";
import Homepage from "./Homepage/Homepage";
import NoPage from "./Errors/NoPage";
import Game from "./Game";
import Leaderboard from "./Leaderboard";
import Chat from "./Chat/Chat";
import Profile from "./Profile";
import { ThemeProvider } from "@mui/styles";
import { Box, createTheme, CssBaseline } from "@mui/material";
import { Toolbar, Grid } from "@mui/material";

function GameModule() {

    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <h1> This is the
                        <strong> GAME MODULE  </strong>
                        page
                    </h1>
                </Grid>
            </Grid>
        </Fragment>
    );
}
export default GameModule;

