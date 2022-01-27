import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

type PropsMenuButton = {
    options : string[];
    buttonNb : number;
}

type PropsGame = {
    width: number,
    height: number, 
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    user : {},
}

type GameSate = {
        ball: {
            x : number,
            y : number           
        },
        paddles: {
            ly: number,
            lh: number,
            ry: number,
            rh: number,
        },
        score: {
            p1: number,
            p2: number
        },
        players: {
            p1: string,
            p2: string
        },
        state: number,
        message : string,
        is_winner : boolean,
    }

type GameParams = {
    width : number, 
    height : number,
    paddle_h : number, 
    paddle_w : number,
    ball_radius : number, 
    ball_speed : number,
    l_paddle_x: number,
    r_paddle_x: number, 
    paddle_init_y : number,
    color_object : string, 
    color_background : string, 
    font_text : string, 
    paddle_speed : number,
    WAIT : number,
    PLAY : number,
    PAUSE : number,
    OVER : number,
    }

export type {PropsMenuButton, PropsGame, GameSate, GameParams};