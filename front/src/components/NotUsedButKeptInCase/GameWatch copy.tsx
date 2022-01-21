import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from '../Game/GameTypes';
import { useState, useEffect, useRef } from 'react';
//import socket from './socket';
import { Button, Grid } from '@mui/material';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { draw_line, draw_background, draw_paddle, draw_ball, draw_text } from '../Game/GameDraw';


//import { socketContext } from '../../contexts/SocketContext';
//import { useContext } from 'react';

export default function GameWatch(props: PropsGame) {

    // All constants
    const socket = props.socket;
    const ref = useRef<HTMLCanvasElement>(null!);
    //const width : number = parseFloat(props.width);
    //const height : number = parseFloat(props.height);
    const width : number = 800;
    const height : number = 600;
    const paddle_h : number = height / 6;
    const paddle_w : number = width / 80;
    const ball_radius : number = 9;
    const ball_speed : number = 10;
    const l_paddle_x: number = 5; //2?
    const r_paddle_x: number = width - paddle_w - l_paddle_x; // pas sure
    const paddle_init_y : number= (height / 2) - (paddle_h /2)
    const color_object : string = "#FFEE00";
    const color_background : string = "#1B1B1B";
    const font_text : string = "50px gameFont";
    const paddle_speed : number = 10;

    const WAIT=0;
    const PLAY=1;
    const PAUSE=2;
    const OVER=3;

    const initGame = {
        ball: {
            x : width / 2,
            y : height / 2            
        },
        paddles: {
            ly: paddle_init_y,
            ry: paddle_init_y
        },
        score: {
            p1: 0,
            p2: 0
        },
        state: WAIT,
        is_winner : false
    }
    
    const [game, setGame] = useState(initGame);
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
            ctx.fillStyle= "#1B1B1B";
            ctx.fillRect(0,0, width, height);        
            ctx.fillStyle = color_object;
            ctx.font = font_text; 
            ctx.fillText("No current game on going", 100, height / 2);
        });
    });
   
          
    //Draw functions
    useEffect(() => {
        let c : HTMLCanvasElement = ref.current; //canvas
        let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context

        function draw_end()
        {
            draw_background(ctx, color_background, width, height);
            draw_text(ctx, game.score.p1.toString(), color_object, "80px gameFont", 3 * (width / 8), height / 2);
            draw_text(ctx, game.score.p2.toString(), color_object,  "80px gameFont", 5 * (width / 8) - 50, height / 2)  
        }

        function draw_pause()
        {
            draw_background(ctx, color_background, width, height);
            draw_text(ctx, "PAUSE", color_object, font_text, width / 2 - 100, height / 2);
        }

        function draw_welcome()
        {
            draw_background(ctx, color_background, width, height);
            draw_text(ctx, "Welcome to Pong Game!", color_object, font_text, 100, height / 2);
        }

        function draw_game()
        {
            draw_background(ctx, color_background, width, height);
            draw_line(ctx,color_object, width, height);
            draw_ball(ctx, color_object, game.ball.x, game.ball.y, ball_radius);
            draw_paddle(ctx, color_object, l_paddle_x, game.paddles.ly, paddle_w, paddle_h);
            draw_paddle(ctx, color_object, r_paddle_x, game.paddles.ry, paddle_w, paddle_h);
            draw_text(ctx, game.score.p1.toString(), color_object, font_text, 3 * (width / 8), height / 12);
            draw_text(ctx, game.score.p2.toString(), color_object, font_text, 5 * (width / 8) - 50, height / 12)    
        }
        
        function draw_all() {
            console.log(`draw all : gameSate = ${game.state}`);
            if (game.state === PLAY)
                draw_game();     
            else if (game.state === OVER)
                draw_end();
            else if (game.state === PAUSE)
                draw_pause();
            else if (game.state === WAIT)
                draw_welcome();
        }
        draw_all();
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
