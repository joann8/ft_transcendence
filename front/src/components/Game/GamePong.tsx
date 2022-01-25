import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
import { Button, FormControlLabel, Modal, Switch } from '@mui/material';
import Grid from '@mui/material/Grid';

import { draw_all } from './GameDraw';
import { gameStateInit } from './GameConst';
import { width, height } from './GameConst';
import { color_object, color_background, font_text } from './GameConst';
import { WAIT, OVER, PAUSE, PLAY } from './GameConst';
import { useNavigate } from 'react-router';
import { stringify } from 'querystring';



export default function GamePong(props: PropsGame) {
    
    // Trouver le user
    const navigate = useNavigate();
    
    const [userID, setUserID] = useState({});

    useEffect(() => {
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
            //setUserID(parseInt(resJson.id))
            setUserID(resJson);
        })
        .catch((err) => {
            console.log("Error caught: ", err);
        })
    };
        getUserId();
    },[]);
    //console.log(`UserID = ${userID}`);

    // Parler avec socket.io
    const socket = props.socket;
    const ref = useRef<HTMLCanvasElement>(null!);
    const [game, setGame] = useState(gameStateInit);


    useEffect(() => {
        socket.on("updateState", (updateState : any) => {
            setGame(updateState);
        });
    });
    
    useEffect(()=> {
        socket.on("wait", (args : any) => {
            console.log("Wait received");
            let c : HTMLCanvasElement = ref.current; //canvas
            let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
            //draw_wait(ctx2, color_background, width, height, color_object, font_text); //==> pas possible , error c = null
            ctx.clearRect(0,0, width, height);
            ctx.beginPath();
            ctx.fillStyle= color_background;
            ctx.fillRect(0,0, width, height);        
            ctx.fillStyle = color_object;
            ctx.font = font_text; 
            ctx.fillText("Waiting for another player", 100, height / 2);
            
        });
    });

    useEffect (() => {
        window.addEventListener('keydown', (e) => {
            if (e.code ==='ArrowUp') {
                socket.emit ('up_paddle', 'down');
            } else if (e.code ==='ArrowDown') {
                socket.emit('down_paddle', 'down');
            }
        }
    );

        window.addEventListener('keyup', (e) => {
            if (e.code ==='ArrowUp') {
                socket.emit ('up_paddle', 'up');
            } else if (e.code ==='ArrowDown'){
                socket.emit('down_paddle', 'up');
            }
        });
    }, []);
        
    //Draw functions
    useEffect(() => {
        let c : HTMLCanvasElement = ref.current; //canvas
        let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
        draw_all(ctx, game,  color_background, width, height, color_object, font_text);
    }, [game]);

    let button;
    if (game.state === WAIT)
        button = <Button variant="contained" onClick={()=> socket.emit('join_queue', userID)} > Join Game </Button>
    else if (game.state === PLAY)
        button = <Button variant="contained" onClick={()=> socket.emit('pause')} > Pause the Game </Button>
    else if (game.state === PAUSE)
        button = <Button variant="contained" onClick={()=> socket.emit('resume')} > Resume to Game </Button>
    else if (game.state === OVER)
        button = <Button variant="contained" onClick={()=> socket.emit('join_queue', userID)} > Start a new Game </Button>
    
    //Additionnal features
    const [ballCheck, setBallCheck] = React.useState(false);
    const [paddleCheck, setPaddleCheck] = React.useState(false);

    const handleChangeBall = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBallCheck(event.target.checked);
        event.target.checked === true  ? socket.emit('ball_on') : socket.emit('ball_off');   
    };
    
    const handleChangePaddle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaddleCheck(event.target.checked);
        event.target.checked === true  ? socket.emit('paddle_on') : socket.emit('paddle_off');   
    };

    useEffect(()=> {
        socket.on("ball_on_server", (args : any) => {
            setBallCheck(true);                    
        });

        socket.on("ball_off_server", (args : any) => {
            setBallCheck(false);                    
        });
    });
    
    return (
        <Fragment>
            <Grid container alignItems="center" justifyContent="center"  >
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <canvas width={width} height={height} ref={ref}> 
                    </canvas>
                </Grid>
                <br/>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    {button}
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <FormControlLabel control={<Switch color="success" checked={ballCheck} onChange={handleChangeBall}/>} label="Accelerate Ball" />
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <FormControlLabel control={<Switch color="success" checked={paddleCheck} onChange={handleChangePaddle}/>} label="Larger Paddle" />
                </Grid>
            </Grid>
        </Fragment>
    );
}
