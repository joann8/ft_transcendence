import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import { draw_all} from './GameDraw';
import { gameStateInit } from './GameConst';
import { width, height } from './GameConst';
import { color_object2, color_background, font_text } from './GameConst';

export default function GameWatch(props: PropsGame) {
    const socket = props.socket;
    const ref = useRef<HTMLCanvasElement>(null!);
    const [game, setGame] = useState(gameStateInit);
    
    useEffect(() => {
        socket.on("updateState", (updateState : any) => {
            setGame(updateState);
        });
    });

    useEffect(() => {
        socket.on("match_over", (updateState : any) => {
            console.log("This match is over");
            let c : HTMLCanvasElement = ref.current; //canvas
            let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
            ctx.clearRect(0,0, width, height);
            ctx.beginPath();
            ctx.fillStyle= color_background;
            ctx.fillRect(0,0, width, height);        
            ctx.fillStyle = color_object2;
            ctx.font = font_text; 
            ctx.fillText("This match is over", 100, height / 2);
        });
    });
         
    useEffect(() => {
        let c : HTMLCanvasElement = ref.current; //canvas
        let ctx : CanvasRenderingContext2D = c.getContext("2d")!; //canvas context
        draw_all(false, ctx, game, color_object2);
    }, [game]);

    return (
        <Fragment>
            <Grid container alignItems="center" justifyContent="center"  >
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <canvas width={width} height={height} ref={ref}> 
                    </canvas>
                </Grid>
            </Grid>
        </Fragment>
    );
};
