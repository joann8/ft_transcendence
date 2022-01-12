import { Toolbar, Grid } from "@mui/material";
import React, { Fragment, useEffect } from "react";

export default function Test() {
    console.log("ici ?")

    useEffect( () => {

        const res = fetch("https://signin.intra.42.fr/users/sign_in")
    }, [])
    return (
        <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <h1> Test Page Adrien</h1>
                </Grid>
            </Grid>
        </Fragment>
    )
}