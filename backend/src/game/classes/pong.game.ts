import { Socket } from "socket.io";
import { States } from "../static/pong.states";
import { Ball } from "./pong.ball";
import { Player } from "./pong.player";
import { v4 as uuidv4} from 'uuid';
import { Const } from "../static/pong.constants";
import { BroadcastObject } from "../static/pong.broadcastObject";
import { Server } from "socket.io";



export class Game {
    private _id : string;
    private _room : string;
    private _server : Server;
    private _endFunction : Function;
    private _player1 : Player;
    private _player2 : Player;
    private _ball: Ball;
    private _state : States;
    private _maxScore : number;
    private _public : Socket[];
    private _interval : NodeJS.Timer;

    constructor(player1: Socket, player2 : Socket, server : Server, endFunction : Function)
    {
        this._id = uuidv4();
        this._room = this._id;
        this._server = server;
        this._endFunction = endFunction;
        this._player1 = new Player(player1, true);
        this._player2 = new Player(player2, false);
        player1.join(this._room);
        player2.join(this._room);
        console.log(`Player 1 (${player1.id}) and Player 2 (${player2.id}) join the room`);
        this._ball = new Ball();
        this._state = States.WAIT; //Play?
        this._maxScore = Const.MAX_SCORE;
        this._public = [];
        this._interval = setInterval(() => this.play(), Const.FPS);

    }

    // Getters & Setters

    public getId() : string {
        return this._id; 
    }

    public getRoom() : string {
        return this._room; 
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
          //  console.log("has winner return 'true'");
            this._state = States.OVER;
            this._ball.pause();
            return true;
        }
       // console.log("has winner return 'false'");
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
        this._server.to(this._room).emit('updateState', currentState);
    }

    public play() : void {
        this.resume();
        this.getBall().updateBall(this);
        this.broadcastState();
        if (this.hasWinner() === true)
        {
            clearInterval(this._interval);
            this.stopMatch();   
        }
    }

    public async pauseAndScore(player : Player) : Promise<void> {
        clearInterval(this._interval);
        clearInterval(this.getPlayer1().getInterval());
        clearInterval(this.getPlayer2().getInterval());
        player.setScore(player.getScore() + 1);
        console.log(`Scores : Player 1 : ${this.getPlayer1().getScore()} | Player 2 : ${this.getPlayer2().getScore()} `)
        this.getBall().reset();

        setTimeout(function(){}, 5000);
        if (this.hasWinner() === false)
        {
            this.getPlayer1().getPaddle().reset();
            this.getPlayer2().getPaddle().reset();
            this._interval = setInterval(() => this.play(), Const.FPS);
        }
        else
            this.stopMatch();
    }

    public disconnectPlayer(client : Socket) : void {
        clearInterval(this._interval);
        if (client === this.getPlayer1().getSocket())
        {
            this.getPlayer1().setScore(0);
            this.getPlayer2().setScore(Const.MAX_SCORE);
        }
        else 
        {
            this.getPlayer2().setScore(0);
            this.getPlayer1().setScore(Const.MAX_SCORE);
        }
        this.stopMatch();
    }

    public sendFinalResult(winner :Player, looser : Player)
    {
        const currentState = this.buildDataToReturn();
        console.log("Send final res...")
        winner.getSocket().emit('updateState', {...currentState, is_winner : true});
        looser.getSocket().emit('updateState', {...currentState, is_winner : false});
    }

    public stopMatch() : void {
        this._state = States.OVER;
        this.getPlayer1().disconnect(this._room);
        console.log(`---> Player 1 (${this.getPlayer1().getSocket().id}) left the room`);
        this.getPlayer2().disconnect(this._room);
        console.log(`--> Player 2 (${this.getPlayer2().getSocket().id}) left the room`);
        if(this.getPlayer1().IsWinner() === true)
            this.sendFinalResult( this.getPlayer1(), this.getPlayer2());
        else
            this.sendFinalResult( this.getPlayer2(), this.getPlayer1());
        this._endFunction(this);
   
    }

}