import * as React from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { io, Socket } from "socket.io-client";
import GameMenu from './GameMenu';
import GameChallenge from './GameChallenge';
import { IUser } from '../Profile/profileStyle';
import GameList from './GameListWatch';
import { useContext } from 'react';
import { Context } from '../MainCompo/SideBars';

export default function Game(props : any) {
    
    let params = useParams()
    let mode = props.mode;

    const navigate = useNavigate();
    const context = useContext(Context);
    const userId = context.user;

    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const newSocket = io("http://127.0.0.1:3001/game", {
            reconnectionDelayMax : 2000,
            });
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
            context.setUpdate(!context.update); // a verifier
        };
    }, []);


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
            else if (res.status === 404) {
                alert(`${pseudo} not found`);
                navigate('/game');
                throw new Error(res.statusText);
            }
            else if (!res.ok && res.status !== 404) 
                throw new Error(res.statusText);
            return (res.json());
        })
        .then((resJson) => {
            console.log(`VISITOR ___pseudo : ${resJson.id_pseudo} | id : ${resJson.id}`);
            setVisitorId(resJson);
            return(resJson);
        })
        .catch((err) => {
            //console.log("Error caught: ", err);
        })
        return data;
    };

    useEffect(() => { 
        if (mode === "challenge" || mode === "watch") 
            getVisitorId(params.id);
    },[]);

    useEffect(() => { 
        if (visitorId && userId)
        { 
            if (userId.id === visitorId.id) {
                alert("You cannot challenge yourself");
                navigate('/game');
            }
            else if (mode === "challenge" && visitorId.status !== "ONLINE")
            {
                alert(`The status of ${visitorId.id_pseudo} is ${visitorId.status}`);
                navigate('/game');
            }
        }
    }, [visitorId]);

    if (mode === "challenge") {
       
        return (
        <Fragment>
            { socket && userId && visitorId? <GameChallenge socket={socket} user={userId} challengee={visitorId}/> : <div> Not ready to challenge </div> }
        </Fragment>
        )
    }
    else if (mode === "watch") {
        return (       
            <Fragment>
                { socket && userId && visitorId? <GameList socket={socket} user={userId} mode={"watch"} watchee={visitorId.id_pseudo} /> : <div> Not ready to watch </div> }
            </Fragment>
        )
    }
    else {
        return (       
            <Fragment>
                { socket && userId ? <GameMenu socket={socket} user={userId}/> : <div> Not ready yet </div> }
            </Fragment>
        )
    }
}

