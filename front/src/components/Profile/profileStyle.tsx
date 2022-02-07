import React from "react";
import backGround from './../Images/complex_logos.jpg'

export interface IRelation {
    userId1: number,
    userId2: number,
    relation1: number,
    relation2: number
}

export interface IUser {
    id: number,
    id_pseudo: string,
    email: string,
    avatar: string,
    role: string,
    elo: number,
    status: string,
    two_factor: boolean,
    achievement1: boolean,
    achievement2: boolean
}


const profileStyle = {
    layout: {
        backgroundImage: `url(` + `${backGround}` + ')',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh',
        display: "flex",
        overflow: "auto"
    },
    boxStyle: {
        position: "relative",
        backgroundColor: "rgba(255,0,0, 0.0)",
        backgroundPosition: 'center',
        //  marginTop: "100px",
        //paddingTop: "15%",
        display: "flex",
        // marginRight: "12%",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        overflow: "hidden"
    },
    container: {
        position: "relative",
        backgroundColor: "rgba(0, 0, 255, 0)", //BLEU
        minWidth: "98%",
        minHeight: "98%",
        marginLeft: "0",
        marginTop: "2%",
        paddingRight: "2px",
        paddingLeft: "2px",
        paddingTop: "2px",
        paddingBottom: "2px",
        display: "grid",
        // justifyContent: "center",
        alignItems: "center",
        // overflow: "auto"
    },
    searchBar: {
        positon: "relative",
        backgroundOrigin: "center",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        display: "flex",
        marginRight: "5px",
        paddingLeft: "5px",
        paddingRight: '2px',
        marginBottom: '2px',
        paddingTop: "2px",
        paddingBottom: "2px",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "70%",
        minHeight: "10%",
    },
    profileBlock: {
        positon: "relative",
        gridAutoFlow: "column",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        marginTop: '2px',
        marginBottom: '2px',
        paddingTop: "2px",
        paddingBottom: "2px",
        display: "grid",
        justifyContent: "space-evenly",
        alignItems: "center",
        minWidth: "100%",
        minHeight: "80%",
        border: '3px solid purple',

    },
    matchHistory: {
        positon: "relative",
        backgroundOrigin: "center",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        display: "flex",
        paddingRight: "2px",
        paddingLeft: "2px",
        marginTop: '2px',
        marginBottom: '2px',
        paddingTop: "2px",
        paddingBottom: "2px",
        //  justifyContent: "center",
        alignItems: "flex-start",
        minWidth: "70%",
        minHeight: "20%"
    },
    textBox: {
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "5%",
        paddingRight: "5%",
    },
    content_1: {
        position: "relative",
        backgroundColor: "rgba(0,0,0, 0.5)",
        color: "rgba(255,255,255,1)",
        minWidth: "15vw",
        width: "100%",
        marginRight: "5px",
        marginLeft: "5px",
        marginTop: '2px',
        marginBottom: '2px',
        paddingTop: "2px",
        paddingBottom: "2px",
        display: "grid",
        border: '1.5px solid purple',
        overflow: "scroll"
    },
    content_2: {
        backgroundColor: "rgba(0,0,0, 0.0)",
        marginRight: "5px",
        marginLeft: "5px",
        marginTop: '2px',
        marginBottom: '2px',
        paddingTop: "2px",
        paddingBottom: "2px",
        display: "grid",
        aligItems: "center",
        justifyContent: "center",

    },
};

export default profileStyle
