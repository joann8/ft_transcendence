import { Socket } from "socket.io";
import { Const } from "../static/pong.constants"
import { Paddle } from "./pong.paddle";

export class Player {
    private _socketId : Socket;
    private _score : number;
    private _isWinner : boolean;
    private _left: boolean; 
    private _paddle : Paddle; 
    private _interval: NodeJS.Timer;

    
    constructor(socketId : Socket, left : boolean) 
    {
        this._socketId = socketId;
        this._score = 0;
        this._isWinner = false;
        this._left = left;
        this._paddle = new Paddle(left);
        this._interval = setInterval(
            () => this._paddle.update(),
            Const.PADDLE_SPEED,
        );
    }
  
    // Getters & Setters

    public getSocket() : Socket {
        return this._socketId;
    }

    public getScore() : number {
        return this._score;
    }

    public setScore(newScore : number) {
        if (newScore >= Const.MAX_SCORE)
        {
            this._score = Const.MAX_SCORE;
            this._isWinner = true;
            console.log(`Player ${this._socketId} on the ${this._left? 'left' : 'right'} won!`);
        }
        else
            this._score = newScore;
    }

    public IsWinner() : boolean {
        return this._isWinner;
    }

    /*
    public setIsWinner(result : boolean) {
        this._isWinner = result; 
    }
    */

    public isLeft() : boolean {
        return this._left;
    }
    
    public getPaddle() : Paddle {
        return this._paddle;
    }

    //Other Functions

    public disconnect() : void {
        clearInterval(this._interval);
    }
}