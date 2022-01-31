import { Socket } from "socket.io";
import { User } from "src/user/entities/user.entity";
import { Const } from "../static/pong.constants"
import { States } from "../static/pong.states";
import { Game } from "./pong.game";
import { Paddle } from "./pong.paddle";

export class Player {
    private _userId : User;
    private _socketId : Socket;
    private _score : number;
    private _isWinner : boolean;
    private _left: boolean; 
    private _paddle : Paddle; 
    private _interval: NodeJS.Timer;

    constructor(dataSet : [Socket, User], left : boolean) 
    {
        this._socketId = dataSet[0];
        this._userId = dataSet[1];
        this._score = 0;
        this._isWinner = false;
        this._left = left;
        this._paddle = new Paddle(left);
        this._interval = setInterval(
            () => this._paddle.update(), Const.FPS
        );
    }
    
    public getUser() : User {
        return this._userId;
    }

    public getSocket() : Socket {
        return this._socketId;
    }

    public getScore() : number {
        return this._score;
    }

    public setScore(newScore : number) {
        if (newScore >= Const.MAX_SCORE) {
            this._score = Const.MAX_SCORE;
            this._isWinner = true;
        }
        else
            this._score = newScore;
    }

    public getInterval() : NodeJS.Timer {
        return this._interval;
    }

    public setInterval(interval : NodeJS.Timer) {
        this._interval = interval;
    }
    
    public isWinner() : boolean {
        return this._isWinner;
    }

    public isLeft() : boolean {
        return this._left;
    }
    
    public getPaddle() : Paddle {
        return this._paddle;
    }

    public disconnect(room : string) : void {
        clearInterval(this._interval);
        this.getSocket().leave(room);
    }
}