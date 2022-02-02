import * as React from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { io, Socket } from "socket.io-client";
import GameMenu from './GameMenu';
import { Toolbar, Typography, Grid, Box } from '@mui/material';
import GameChallenge from './GameChallenge';
import { IUser } from '../Profile/profileStyle';

export default function Game() {
    
    let params = useParams()
    const navigate = useNavigate();

    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const newSocket = io("http://127.0.0.1:3001/game", {
            reconnectionDelayMax : 2000,
            });
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const [userID, setUserID] = useState<IUser>(null);
    const getUserId = async () : Promise<IUser> => {
        const data : Promise<IUser> = await fetch("http://127.0.0.1:3001/user", {
            method: "GET",
            credentials : "include",
            referrerPolicy: "same-origin"
        })
        .then((res) => {
            if (res.status === 401)
                navigate("/login");
            else if (!res.ok)
                throw new Error(res.statusText);
            return (res.json());
        })
        .then((resJson) => {
            console.log(`CHALLENGER ___pseudo : ${resJson.id_pseudo} | id : ${resJson.id}`);
            setUserID(resJson);
            return(resJson);
        })
        .catch((err) => {
            console.log("Error caught: ", err);
        })
        return data;
    };

    useEffect(() => {   
        getUserId();
    },[]);

    const [challengeeID, setChallengeeID] = useState<IUser>(null);
    const getChallengeeId = async (pseudo : string) : Promise<IUser> => {
        const data : Promise<IUser> = await fetch(`http://127.0.0.1:3001/user/${pseudo}`, {
            method: "GET",
            credentials : "include",
            referrerPolicy: "same-origin"
        })
        .then((res) => {
            if (res.status === 401)
                navigate("/login");
            else if (!res.ok)
                throw new Error(res.statusText);
            return (res.json());
        })
        .then((resJson) => {
            console.log(`CHALLENGEE ___pseudo : ${resJson.id_pseudo} | id : ${resJson.id}`);
            setChallengeeID(resJson);
            return(resJson);
        })
        .catch((err) => {
            console.log("Error caught: ", err);
        })
        return data;
    };

    useEffect(() => {  
        if (params.id_pseudo) // challenge
            getChallengeeId(params.id_pseudo);
    },[]);

    if (params.id_pseudo) // challenge
    {
        return (
        <Fragment>
            <Box
                component="main"
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,
                  width: '100vh',
                  overflow: 'auto',
            }}>
                <Toolbar />
                <Grid container alignItems="center" justifyContent="center" style={{ height: "100vh"}}>
                    <Grid item >    
                        { socket && userID && challengeeID? <GameChallenge socket={socket} user={userID} challengee={challengeeID}/> : <div> Not connected </div> }
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
        )
    }
    else
    {
        return (       
                <Fragment>
                { socket ? <GameMenu socket={socket} user={userID}/> : <div> Not connected </div> }
                </Fragment>
        )
    }
}

