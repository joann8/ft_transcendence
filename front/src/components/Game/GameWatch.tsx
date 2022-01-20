import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
import socket from './socket';
import { Button } from '@mui/material';
import { waitForElementToBeRemoved } from '@testing-library/react';

//import { socketContext } from '../../contexts/SocketContext';
//import { useContext } from 'react';

export default function GameWatch(props: PropsGame) {

    // All constants
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

        function draw_background()
        {
            ctx.clearRect(0,0, width, height);
            ctx.beginPath();
            ctx.fillStyle= "#1B1B1B";
            ctx.fillRect(0,0, width, height);
        }

        function draw_line(color : string)
        {
            ctx.setLineDash([10, 15]);
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(width /2, 0);
            ctx.lineTo(width / 2, height);
            ctx.stroke();            
        }

        function draw_ball(color : string, x : number,y : number ,radius : number)
        {
            ctx.beginPath(); //clear path
            ctx.arc(x, y, radius, 0, 2* Math.PI); // create circular item position x,y radius start end 
            ctx.fillStyle = color;
            ctx.fill();
        }

        function draw_paddle(color : string, x : number, y : number)
        {
            ctx.beginPath();
            ctx.fillStyle= color;
            ctx.fillRect(x,y, paddle_w, paddle_h);
        }

        function draw_text(text : string, color : string, font : string, x : number, y : number)
        {
            ctx.fillStyle = color;
            ctx.font = font; 
            ctx.fillText(text, x, y);
        }

        function draw_end()
        {
            draw_background();
            //Message unique pour les 2 joeurs + public
            draw_text(game.score.p1.toString(), color_object, "80px gameFont", 3 * (width / 8), height / 12);
            draw_text(game.score.p2.toString(), color_object,  "80px gameFont", 5 * (width / 8) - 50, height / 12)  

            /*
            if (game.is_winner === true)
                draw_text("You won!", color_object, font_text, width / 2 - 130, height / 2);
            else
                draw_text("You lose!", color_object, font_text, width / 2 - 130, height / 2);
                */
        }

        function draw_pause()
        {
            draw_background();
            draw_text("PAUSE", color_object, font_text, width / 2 - 100, height / 2);
        }

        function draw_welcome()
        {
            draw_background();
            draw_text("Welcome to Pong Game!", color_object, font_text, 100, height / 2);
        }

        function draw_all() {
            console.log(`draw all : gameSate = ${game.state}`);
            if (game.state === PLAY)
            {
                draw_background();
                draw_line(color_object);
                draw_ball(color_object, game.ball.x, game.ball.y, ball_radius);
                draw_paddle(color_object, l_paddle_x, game.paddles.ly);
                draw_paddle(color_object, r_paddle_x, game.paddles.ry);
                draw_text(game.score.p1.toString(), color_object, font_text, 3 * (width / 8), height / 12);
                draw_text(game.score.p2.toString(), color_object, font_text, 5 * (width / 8) - 50, height / 12)    
            }
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
            <canvas width={width} height={height} ref={ref}> 
            </canvas>
            {button}
        </Fragment>
    );
};
