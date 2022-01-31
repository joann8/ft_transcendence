import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

type PropsMenuButton = {
    options : string[];
    buttonNb : number;
}
type PropsInit = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    user : {},
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
}

export type {PropsMenuButton, PropsInit, PropsGame, GameSate};