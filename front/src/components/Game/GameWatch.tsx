import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
//import socket from './socket';
import { Button, Grid } from '@mui/material';

import { draw_all, draw_background, draw_nogame } from './GameDraw';
import { gameStateInit } from './GameConst';
import { width, height } from './GameConst';
import { color_object2, color_background, font_text } from './GameConst';
import { WAIT, OVER, PAUSE, PLAY } from './GameConst';

//import { socketContext } from '../../contexts/SocketContext';
//import { useContext } from 'react';

export default function GameWatch(props: PropsGame) {
    const socket = props.socket;
    const ref = useRef<HTMLCanvasElement>(null!);
    const [game, setGame] = useState(gameStateInit);
    const [watching, setWatching] = useState(false);
    
    useEffect(() => {
        socket.on("updateState", (updateState : any) => {
            setGame(updateState);
        });
    });

    useEffect(() => {
        socket.on("no_current_match", (updateState : any) => {
            console.log("No current game received");
            setWatching(false);

            let c : HTMLCanvasElement = ref.current; //canvas
            let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
            ctx.clearRect(0,0, width, height);
            ctx.beginPath();
            ctx.fillStyle= color_background;
            ctx.fillRect(0,0, width, height);        
            ctx.fillStyle = color_object2;
            ctx.font = font_text; 
            ctx.fillText("No current game on going", 100, height / 2);
        });
    });
         
    useEffect(() => {
        let c : HTMLCanvasElement = ref.current; //canvas
        let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
        draw_all(ctx, game, color_background, width, height, color_object2, font_text);
    }, [game]);

    let button;
    if (watching === false)
        button = <Button variant="contained" onClick={()=> {
            setWatching(true);
            socket.emit('watch_random');
        }} > Watch a Game </Button>;
    else
        button = <Button variant="contained" onClick={()=> {
            setWatching(false);
            socket.emit('unwatch_game')}
        } > Stop the streaming </Button>;
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
            </Grid>
        </Fragment>
    );
};
