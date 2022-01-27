import { States } from "./pong.states";

export interface BroadcastObject {
    ball: {
        x : number,
        y : number,    
    },
    paddles: {
        ly: number,
        lh: number,
        ry: number, 
        rh : number
    },
    score: {
        p1: number,
        p2: number
    },
    players: {
        p1: string,
        p2: string
    },
    state: States,
    message : string
}