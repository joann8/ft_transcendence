import { Socket } from "socket.io";
import { States } from "../static/pong.states";
import { Ball } from "./pong.ball";
import { Player } from "./pong.player";
import { v4 as uuidv4} from 'uuid';
import { Const } from "../static/pong.constants";
import { BroadcastObject } from "../static/pong.broadcastObject";



export class Game {
    private _id : string;
    private _room : string;
    private _player1 : Player;
    private _player2 : Player;
    private _ball: Ball;
    private _state : States;
    private _maxScore : number;
    private _public : Socket[];
    private _interval : NodeJS.Timer;

    constructor(player1: Socket, player2 : Socket)
    {
        this._id = uuidv4();
        this._room = this._id;
        this._player1 = new Player(player1, true);
        this._player2 = new Player(player2, false);
        this._ball = new Ball();
        this._state = States.WAIT; //Play?
        this._maxScore = Const.MAX_SCORE;
        this._public = [];
        this._interval = setInterval(() => this.play());
    }

    // Getters & Setters

    public getId() : string {
        return this._id; 
    }

    public getPlayer1() : Player {
        return this._player1;
    }

    public getPlayer2() : Player {
        return this._player2;
    }

    public getBall() : Ball {
        return this._ball;
    }

    public getState() : States {
        return this._state;
    }


    // Other Functions 

    public hasWinner() : boolean {
        if (this._player1.IsWinner() || this._player2.IsWinner())
        {
            this._state = States.OVER;
            return true;
        }
        return false;
    }

    public pause() : void
    {
        this._state = States.PAUSE;
        this._ball.pause();
    }

    public resume() : void
    {
        this._state = States.PLAY;
        this._ball.resume();
    }

    public buildDataToReturn() : BroadcastObject {
        return ( {
        ball: {
            x : this._ball.getX(),
           // xp : number,
            y : this._ball.getY(),    
            //yp : number,
        },
        paddles: {
            ly: this._player1.getPaddle().getY(),
            //lyp : number,
            ry: this._player2.getPaddle().getY(),
            //ryp: number, 
        },
        score: {
            p1: this._player1.getScore(),
            p2: this._player2.getScore()
        },
        state: this._state,
        });
    }
    
    public broadcastState() : void {
        const currentState = this.buildDataToReturn();
        

    }

    public play() : void {
        
    }

}