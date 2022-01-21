import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from '@mui/material';
import Grid from '@mui/material/Grid';

import { draw_all } from './GameDraw';
import { gameStateInit } from './GameConst';
import { width, height } from './GameConst';
import { color_object, color_background, font_text } from './GameConst';
import { WAIT, OVER, PAUSE, PLAY } from './GameConst';


export default function GamePong(props: PropsGame) {
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
        button = <Button variant="contained" onClick={()=> socket.emit('join_queue')} > Join Game </Button>;
    else if (game.state === PLAY)
        button = <Button variant="contained" onClick={()=> socket.emit('pause')} > Pause the Game </Button>;
    else if (game.state === PAUSE)
        button = <Button variant="contained" onClick={()=> socket.emit('resume')} > Resume to Game </Button>;
    else if (game.state === OVER)
        button = <Button variant="contained" onClick={()=> socket.emit('join_queue')} > Start a new Game </Button>;
    
    //useCheckLocation();
    
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
