import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";
import { Navigate, useNavigate } from "react-router";
import { setFlagsFromString } from "v8";

export default function Login(props: any) {

    let navigate = useNavigate()

    //Deals with Tom's back end to check Authentication
    function handleLogin() {
        //const authSuccess = checkWithBackend()
        const authSuccess = true
        if (authSuccess) {
            props.setLogin(true)
            navigate("/")
        }

    }
    if (props.login) {

        return (<Navigate to="/" />)
    }
    else {

        return (
            <Fragment>
                <Toolbar />
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                        <h1> Login Page</h1>
                        <button type="submit" onClick={() => handleLogin()}> Login </button>
                        <p> {`Logout code was executed : ${props.count} times`} </p>
                    </Grid>
                </Grid>
            </Fragment>
        )


        /* return (
             <Fragment>
                 <Toolbar />
                 <Grid container alignItems="center" justifyContent="center">
                     <Grid item>
                         <h1> Login Page</h1>
                         <button type="submit" onClick={() => props.setLogin(true)}> Login </button>
                         <button type="submit" onClick={() => props.setLogin(false)}> Logout </button>
                         <p> Login value : {props.login ? "true" : "false"} </p>
                     </Grid>
                 </Grid>
             </Fragment>
         )
         */
    }
}