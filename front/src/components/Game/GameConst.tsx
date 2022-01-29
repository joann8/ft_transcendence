import { GameSate } from "./GameTypes";


const width : number = 800;
const height : number = 600;
const paddle_h : number = height / 6;
const paddle_w : number = width / 80;
const ball_radius : number = 9;
//const ball_speed : number = 10; // not needed
const l_paddle_x: number = 0;
const r_paddle_x: number = width - paddle_w; 
const paddle_init_y : number= (height / 2) - (paddle_h /2)
const color_object : string = "#FFEE00";
const color_object2 : string = "#7CFC00";
const color_background : string = "#1B1B1B";
const font_text : string = "50px gameFont";
//const paddle_speed : number = 10; //not needed
const WAIT=0;
const PLAY=1;
const PAUSE=2;
const OVER=3;

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
    state: PLAY,
    message : "", 
    is_winner : false,

}

export {gameStateInit, width, height, paddle_w, paddle_h, paddle_init_y, ball_radius, l_paddle_x, r_paddle_x}
export {WAIT, PLAY, PAUSE, OVER}
export {color_background, color_object, color_object2, font_text}
