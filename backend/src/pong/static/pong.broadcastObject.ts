import { States } from "./pong.states";

export interface BroadcastObject {
    ball: {
        x : number,
       // xp : number,
        y : number,    
        //yp : number,
    },
    paddles: {
        ly: number,
        lh: number,
        //lyp : number,
        ry: number, 
        rh : number
        //ryp: number, 
    },
    score: {
        p1: number,
        p2: number
    },
    state: States,
    message : string
}