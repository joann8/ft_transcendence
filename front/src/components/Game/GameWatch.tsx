import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import { draw_all} from './GameDraw';
import { gameStateInit } from './GameConst';
import { width, height } from './GameConst';
import { color_object3, color_background, font_text } from './GameConst';

export default function GameWatch(props: PropsGame) {
    const socket = props.socket;
    const ref = useRef<HTMLCanvasElement>(null!);
    const [game, setGame] = useState(gameStateInit);
    
    useEffect(() => {
        socket.on("updateState", (updateState : any) => {
            setGame(updateState);
        });
        return () => {
            socket.removeAllListeners("updateState");
        };
    });

    useEffect(() => {
        if (ref) {
            let c : HTMLCanvasElement = ref.current; 
            let ctx : CanvasRenderingContext2D = c.getContext("2d")!;
            draw_all(false, ctx, game, color_object3);
        }
    }, [game]);

    return (
        <Fragment>
            <Grid container alignItems="center" justifyContent="center" >
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <canvas width={width} height={height} ref={ref}> 
                    </canvas>
                </Grid>
            </Grid>
        </Fragment>
    );
};
