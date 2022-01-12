import { Toolbar, Grid } from "@mui/material";
import React, { Fragment } from "react";
import { Navigate } from "react-router";

function PrivateRoute(props : any){
                    //call to TomBackEnd
    const auth = props.login
    return (auth ?  props.children : <Navigate to="/login"/>)
}
export default PrivateRoute
