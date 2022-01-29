import * as React from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { io, Socket } from "socket.io-client";
import GameMenu from './GameMenu';

export default function Game() {
    
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

    const [userID, setUserID] = useState({});

    const getUserId = async () => {
        fetch("http://127.0.0.1:3001/user", {
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
            console.log(`pseudo : ${resJson.id_pseudo} | id : ${resJson.id}`);
            setUserID(resJson);
        })
        .catch((err) => {
            console.log("Error caught: ", err);
        })
    };

    useEffect(() => {   
        getUserId();
    },[]);
     
  return (       
        <Fragment>
        { socket ? <GameMenu socket={socket} user={userID} /> : <div> Not connected </div> }
        </Fragment>
  )
}

