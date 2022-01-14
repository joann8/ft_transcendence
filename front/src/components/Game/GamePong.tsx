import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
import socket from './socket';
import { Button } from '@mui/material';

export default function GamePong(props: PropsGame) {

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
    /*
    const enum Status {
        WAIT, 
        PLAY, 
        PAUSE,
        OVER, 
    };
    */
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
        //state: Status.WAIT,
        is_winner : false
    }
    
    const [game, setGame] = useState(initGame);

    socket.on("updateState", (updateState : any) => {
        setGame(updateState);
    });

    useEffect (() => {
        window.addEventListener('keydown', (e) => {
            if (e.code ==='ArrowUp') {
                socket.emit ('up_paddle', 'down');
                console.log("keydown clicked for up");
            } else if (e.code ==='ArrowDown') {
                socket.emit('down_paddle', 'down');
                console.log("keydown clicked for down");
            }
        }
        );

        window.addEventListener('keyup', (e) => {
            if (e.code ==='ArrowUp') {
                socket.emit ('up_paddle', 'up');
                console.log("keyup clicked for up");
            } else if (e.code ==='ArrowDown'){
                socket.emit('down_paddle', 'up');
                console.log("keyup clicked for down");
            }
        }
        );
    }, []);
        
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
            if (game.is_winner === true)
                draw_text("You won!", color_object, font_text, width / 2 - 130, height / 2);
            else
                draw_text("You lose!", color_object, font_text, width / 2 - 130, height / 2);
        }

        /*
        function draw_wait()
        {
            draw_background();
            draw_text("Waiting for another player", color_object, font_text, width + 50, height / 2);
        }

        function draw_welcome()
        {
            draw_background();
            draw_text("Welcome to Pong Game!", color_object, font_text, width + 100, height / 2);
        }
        */

        function draw_all() {

            
            ctx.clearRect(0,0, width, height);
            draw_background();
            draw_line(color_object);
            draw_ball(color_object, game.ball.x, game.ball.y, ball_radius);
            draw_paddle(color_object, l_paddle_x, game.paddles.ly);
            draw_paddle(color_object, r_paddle_x, game.paddles.ry);
            draw_text(game.score.p1.toString(), color_object, font_text, 3 * (width / 8), height / 12);
            draw_text(game.score.p2.toString(), color_object, font_text, 5 * (width / 8) - 50, height / 12)    
            
            if (game.state === OVER)
                draw_end();
        }

        draw_all();
    }, [game]);


    return (
        <Fragment>
            <canvas width={width} height={height} ref={ref}> </canvas>
            <Button variant="contained" onClick={()=> socket.emit('join_queue')} > Join Game </Button>
        </Fragment>
    );
};
