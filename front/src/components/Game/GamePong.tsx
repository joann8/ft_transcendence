import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
import { Button, FormControlLabel, Switch } from '@mui/material';
import Grid from '@mui/material/Grid';
import { draw_all } from './GameDraw';
import { gameStateInit } from './GameConst';
import { width, height } from './GameConst';
import { color_object, color_background, font_text } from './GameConst';
import { WAIT, OVER, PAUSE, PLAY } from './GameConst';

export default function GamePong(props: PropsGame) {
    
    const socket = props.socket;
    const ref = useRef<HTMLCanvasElement>(null!);

    useEffect(() => {
        //console.log(props.user)      
        socket.emit('join_queue', props.user);
    }, []);

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

    useEffect(()=> {
        socket.on("already_connected", (args : any) => {
            console.log("Already connected received");
            let c : HTMLCanvasElement = ref.current; //canvas
            let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
            //draw_wait(ctx2, color_background, width, height, color_object, font_text); //==> pas possible , error c = null
            ctx.clearRect(0,0, width, height);
            ctx.beginPath();
            ctx.fillStyle= color_background;
            ctx.fillRect(0,0, width, height);        
            ctx.fillStyle = color_object;
            ctx.font = font_text; 
            ctx.fillText("You are already connected on another screen", 30, height / 2);
        });
    });

    useEffect (() => {
        window.addEventListener('keydown', (e) => {
            if (e.code ==='ArrowUp') {
                socket.emit('up_paddle', 'down');
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
          
    //Additionnal features
    const [ballCheck, setBallCheck] = useState(false); // initial state (not activated)
    const [paddleCheck, setPaddleCheck] = useState(false); // initial state (not activated)
    const [backImage, setBackImage] = useState(false); // initial state (not activated)

    // false when click for first time // true second time (inverse)
    const handleChangeBall = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBallCheck(event.target.checked);
        event.target.checked === true  ? socket.emit('ball_on') : socket.emit('ball_off');   
        console.log(`ballcheck : ${ballCheck}`);

    };
    
    // false when click for first time // true second time (inverse)
    const handleChangePaddle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaddleCheck(event.target.checked);
        event.target.checked === true  ? socket.emit('paddle_on') : socket.emit('paddle_off'); 
        console.log(`paddlecheck : ${paddleCheck}`);
    };

    // false when click for first time // true second time (inverse)
    const handleBackImage= (event: React.ChangeEvent<HTMLInputElement>) => {
        setBackImage(event.target.checked);
        console.log(`backImage : ${backImage}`);
    };

    useEffect(()=> {
        socket.on("ball_on_server", (args : any) => {
            setBallCheck(true);                    
        });

        socket.on("ball_off_server", (args : any) => {
            setBallCheck(false);                    
        });
    });


    //Draw functions
    useEffect(() => {
        console.log("Draw!");
        let c : HTMLCanvasElement = ref.current; //canvas
        let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
        draw_all(backImage, ctx, game, color_object);
    }, [game, backImage]);
    
    return (
        <Fragment>
            <Grid container alignItems="center" justifyContent="center"  >
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <FormControlLabel control={<Switch color="success" checked={backImage} onChange={handleBackImage}/>} label="Change Background" />
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <canvas width={width} height={height} ref={ref}> 
                    </canvas>
                </Grid>
                <br/>
               {/*} <Grid item xs={12} style={{textAlign: "center"}}>
                    {button}
                 </Grid>*/}
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
