import * as React from 'react';
import { Fragment } from 'react';
import { PropsGame } from './GameTypes';
import { useState } from 'react';
import { useEffect } from 'react';

export default function GamePong(props : PropsGame) {

    // All constants
    //const ref = useRef();
    const width : number = props.width;
    const height : number = props.height;
    const paddle_h : number = height / 6;
    const paddle_w : number = 10;
    const ball_radius : number = 9;
    const l_paddle_x: number = 0; //2?
    const r_paddle_x: number = width - paddle_w; //- left_paddle_x; // pas sure
    const paddle_init_y : number= (height / 2) - (paddle_h /2)
    const enum Status {
        Wait, 
        Play, 
        Over, 
    };

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
        state: Status.Wait,
        has_winner : false
    }
    
    const [frame, setFrame] = useState(initGame);

    //Draw functions
    /*
    useEffect(( => {
        let c = ref.current; 

    });


    return (
        <Fragment>

        </Fragment>

    );*/
};
