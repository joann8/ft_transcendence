import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { IUser } from "../Profile/profileStyle"

type PropsMenuButton = {
    options : string[];
    buttonNb : number;
}
type PropsInit = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    user : IUser,
}

type PropsGame = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    user : IUser,
    mode: string,
}

type PropsChallenge = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    user : IUser,
    challengee: IUser,
}

type PropsWatch = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    user : IUser,
    mode: string,
    watchee : string
}

type GameState = {
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

export type {PropsMenuButton, PropsInit, PropsChallenge, PropsGame, PropsWatch, GameState};