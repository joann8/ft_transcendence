import { GameSate } from "./GameTypes";

const width : number = 800;
const height : number = 600;
const paddle_h : number = height / 6;
const paddle_w : number = width / 80;
const ball_radius : number = 9;
const l_paddle_x: number = 0;
const r_paddle_x: number = width - paddle_w; 
const paddle_init_y : number= (height / 2) - (paddle_h /2)
const color_object : string = "#FFEE00";
const color_object2 : string = "#000000";
const color_object3 : string = "#7CFC00";
const color_background : string = "#1B1B1B";
const color_background2 : string = "#DCDCDC";
const font_text : string = "50px gameFont";
const WAIT=0;
const PLAY=1;
const OVER=2;

const gameStateInit : GameSate = {
    ball: {
        x : width / 2,
        y : height / 2            
    },
    paddles: {
        ly: paddle_init_y,
        lh : paddle_w,
        ry: paddle_init_y,
        rh : paddle_w,
    },
    score: {
        p1: 0,
        p2: 0
    },
    players: {
        p1: "",
        p2: ""
    },
    state: WAIT,
}

export {gameStateInit, width, height, paddle_w, paddle_h, paddle_init_y, ball_radius, l_paddle_x, r_paddle_x}
export {WAIT, PLAY, OVER}
export {color_background, color_background2,color_object, color_object2, color_object3, font_text}
