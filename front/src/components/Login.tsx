import { Toolbar, Grid, Link, fabClasses } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { setFlagsFromString } from "v8";
const urlBackEnd = "http://localhost:3001/user/adconsta"
const url42 = "https://signin.intra.42.fr/users/sign_in"
export default function Login(props: any) {

    let navigate = useNavigate()

    //Deals with Tom's back end to check Authentication
    function handleLogin() {

        //Get backEnd Json

       //window.location.href = backUrlLogin

       const res = fetch(url42,
        {
            mode : 'cors'
        })
       console.log(res)
/*
        const fetchData = async () => {
            let status : number;
            const result = await fetch (urlBackEnd, 
                {
                    mode : "cors"
                })
            .then(function(response) {
                status = response.status
                response.json()
                .then(function(parsedJson) {
                    console.log(parsedJson)
                })
                })
            }
            fetchData();
*/
       
       console.log("42 redirection done")

        if (props.login === false){
            props.setLogin(true)
            console.log("Login.tsx : isAuth =",  props.login)
        }
    }


    if (props.isAuth) {
        console.log("login redirect")
        return (<Navigate to="/" />)
    }
    else {
        return (
            <Fragment>
                <Toolbar />
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                        <h1> This is the Login Page</h1>
                        <button type="submit" onClick={() => handleLogin()}> Login </button>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}