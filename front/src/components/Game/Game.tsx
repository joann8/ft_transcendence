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
import GameWatch from './GameWatch';
import GameList from './GameListWatch';

export default function Game(props : any) {
    
    let params = useParams()
    let mode = props.mode;

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

    const [userId, setUserId] = useState<IUser>(null);
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
            setUserId(resJson);
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

    const [visitorId, setVisitorId] = useState<IUser>(null);
    const getVisitorId = async (pseudo : string) : Promise<IUser> => {
        const data : Promise<IUser> = await fetch(`http://127.0.0.1:3001/user/${pseudo}`, {
            method: "GET",
            credentials : "include",
            referrerPolicy: "same-origin"
        })
        .then((res) => {
            console.log("return from database GAME:", res.status)
            if (res.status === 401)
                navigate("/login");
            else if (!res.ok)
                throw new Error(res.statusText);
            return (res.json());
        })
        .then((resJson) => {
            console.log(`VISITOR ___pseudo : ${resJson.id_pseudo} | id : ${resJson.id}`);
            setVisitorId(resJson);
            return(resJson);
        })
        .catch((err) => {
            console.log("Error caught: ", err);
        })
        return data;
    };

    useEffect(() => { 
        console.log("params : ", params)
        console.log("mode : ", mode)
        console.log("params id peuso: ", params.id)
        if (mode === "challenge" || mode === "watch") // challenge
            getVisitorId(params.id);
    },[]);

  //  if (params.id_pseudo) // challenge
    if (mode === "challenge") // challenge
    {
        return (
        <Fragment>
            { socket && userId && visitorId? <GameChallenge socket={socket} user={userId} challengee={visitorId}/> : <div> Not ready to challenge </div> }
        </Fragment>
        )
    }
    else if (mode === "watch") // challenge
    {
        return (       
            <Fragment>
                { socket && userId && visitorId? <GameList width={800} height={600} socket={socket} user={userId} mode={"watch"} watchee={visitorId.id_pseudo} /> : <div> Not ready to watch </div> }
            </Fragment>
        )
    }
    else
    {
        return (       
            <Fragment>
                { socket && userId ? <GameMenu socket={socket} user={userId}/> : <div> Not ready yet </div> }
            </Fragment>
        )
    }
}

