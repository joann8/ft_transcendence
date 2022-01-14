import React from "react";
import { Navigate, useLocation } from "react-router";

function PrivateRoute(props: any) {
    const currentUrl = useLocation()
    console.log(currentUrl)
        //call to TomBackEnd
    /*const auth = fetch(`${urlBackEnd}/login/42), {
        myJwt : 
    } ou autre ?
    {  
        redirection_info : ${currentUrl}
        jwtCookie_info : ${currentJwtCookie}
    }
    //Cas 1 : Auth ok --> Redirection vers currentUrl
    //Cas 2: Auth necessaire --> Back_End redirection
            //Auth double facteur --> en interne dans Back_end ?
            // Auth fini --> Redirection vers currentUrl

    //Cas 3 : Auth failed : Retry auth ? 
    */
   
    const auth = props.login
    console.log("Private Route auth = ", auth)
    return (auth ? props.children : <Navigate to="/login" />)
}

export default PrivateRoute
