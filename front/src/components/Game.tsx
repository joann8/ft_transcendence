import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";
import { Outlet } from "react-router";
import GameModule from "./GameModule";
import { Route, Routes, Link, BrowserRouter as Router } from "react-router-dom";

export default function GameMenu() {
    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                <h1> This is the 
                        <strong> GAME MENU </strong> 
                        page 
                    </h1>
                </Grid>
            </Grid>
            <Outlet/>
            <Routes>
                <Route path="module" element={<GameModule/>}/>
            </Routes>
        </Fragment>
    )
}