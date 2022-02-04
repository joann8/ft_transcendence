import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import Grid from '@mui/material/Grid';
import { draw_all } from './GameDraw';
import { gameStateInit, color_object, width, height} from './GameConst';

export default function GamePong(props: PropsGame) {
    
    const socket = props.socket;
    const ref = useRef<HTMLCanvasElement>(null!);
    
    useEffect(() => {
        if (props.mode === "random")
            socket.emit('join_queue', props.user);
    }, []);
    
    const [game, setGame] = useState(gameStateInit);

    useEffect(() => {
        socket.on("updateState", (updateState : any) => {
            setGame(updateState);
        });
        return () => {
            socket.removeAllListeners("updateState");
        };
    }, []);
    

    useEffect (() => {
        window.addEventListener('keydown', (e) => {
            if (ref)
            {
                if (e.code ==='ArrowUp') {
                    socket.emit('up_paddle');
                } else if (e.code ==='ArrowDown') {
                    socket.emit('down_paddle');
                }
            }
        })
    }, []);
    
    //Additionnal features
    const [ballCheck, setBallCheck] = useState(false); // initial state (not activated)
    const [paddleCheck, setPaddleCheck] = useState(false); // initial state (not activated)
    const [colorMode, setColorMode] = useState(false); // initial state (not activated)

    // false when click for first time // true second time (inverse)
    const handleChangeBall = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBallCheck(event.target.checked);
        event.target.checked === true  ? socket.emit('ball_on') : socket.emit('ball_off');   
    };
    
    // false when click for first time // true second time (inverse)
    const handleChangePaddle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaddleCheck(event.target.checked);
        event.target.checked === true  ? socket.emit('paddle_on') : socket.emit('paddle_off'); 
    };

    // false when click for first time // true second time (inverse)
    const handleColorMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColorMode(event.target.checked);
    };

    useEffect(()=> {
        socket.on("ball_on_server", (args : any) => {
            setBallCheck(true);                    
        });

        socket.on("ball_off_server", (args : any) => {
            setBallCheck(false);                    
        });

        return () => {
            socket.removeAllListeners("ball_on_server");
            socket.removeAllListeners("ball_off_server");
        };
    }, []);

    useEffect(() => {
        if (ref)
        {
            let c : HTMLCanvasElement = ref.current; //canvas
            let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
            draw_all(colorMode, ctx, game, color_object);
        }
    }, [game, colorMode]);
    
    return (
        <Fragment>
            <Grid container alignItems="center" justifyContent="center"  >
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <FormControlLabel control={<Switch color="success" checked={colorMode} onChange={handleColorMode}/>} label="Change Background" />
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <canvas width={width} height={height} ref={ref}> 
                    </canvas>
                </Grid>
                <br/>
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
