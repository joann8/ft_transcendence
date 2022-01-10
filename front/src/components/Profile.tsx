import { Toolbar, Grid } from "@mui/material";
import React, { Fragment, useEffect, useReducer, useState } from "react";


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

       /*useEffect ( async () => {
            code here
    } ??
    */
   /*
    useEffect(() => {
        fetch(`${backEndUrl}user/joann`)
            .then(res => res.json())
            .then(
                (result) => {
                    setReady(true);
                    setItems(result);
                    console.log("ici")
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setReady(true);
                    setError(error);
                }
            )
    }, [])
    */
   useEffect(() => {
       const fetchData = async () => {
           let status : number;
           const result = await fetch (`${backEndUrl}/user/joann`)
           .then(function(response) {
               status = response.status
               response.json()
               .then(function(parsedJson) {
                   setItems(parsedJson)
                   setStatus(status)
                   setReady(true)
               })
               })
           }
           fetchData();
        }, [])
    /*
  fetch(`${backEndUrl}user/joann`)
      .then(function (response) {
          response.json()
              .then(function (parsedJson) {
                  items = parsedJson
                  setReady(true)
              })
      })
 //     console.log('This is TMP', items);

 */
    if (status !== 200 ) {
        return (
            <Fragment>
                <Toolbar />
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                        <h1> 
                            Error : Redirection vers le Login
                        </h1>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
    else if (!ready) {
        return (
            <Fragment>
            <Toolbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <h1> 
                        Loading: ...
                    </h1>
                </Grid>
            </Grid>
        </Fragment>
        )
    }
    else {
        return (
            <Fragment>
                <Toolbar />
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                        <h1> This is the
                            <strong> Profile </strong>
                            page
                            <div>
                                id: = {items.id}.<br />
                                id_pseudo: {items.id_pseudo}.<br />
                                email: {items.email}.<br />
                                avatar: {items.avatar}<br />
                                role: {items.role}.<br />
                                elo: {items.elo}.<br />
                                status: {items.status}.<br />
                                two_factor: {items.two_factor}.<br />
                                achievement1: {items.achievement1}.<br />
                                achievement2: {items.achievement2}.<br />
                            </div>
                        </h1>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}