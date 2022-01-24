import { Socket } from "socket.io";
import { States } from "../static/pong.states";
import { Ball } from "./pong.ball";
import { Player } from "./pong.player";
import { v4 as uuidv4} from 'uuid';
import { Const } from "../static/pong.constants";
import { BroadcastObject } from "../static/pong.broadcastObject";
import { Server } from "socket.io";
import { PongService } from "../pong.service";
import { Repository } from "typeorm";
import { Pong } from "../entities/pong.entity";
import { InjectRepository } from "@nestjs/typeorm";



export class Game {
    private _id : string;
    private _room : string;
    private _server : Server;
    private _endFunction : Function;
    private _player1 : Player;
    private _player2 : Player;
    private _ball: Ball;
    private _state : States;
    private _public : Socket[];
    private _interval : NodeJS.Timer;
    private _isEnded : boolean;
    private readonly gameRepo =  new PongService(new Repository<Pong>());

   // constructor(player1: Socket, player2 : Socket, server : Server, endFunction : Function)
    constructor(queue: Map<Socket, number>, server : Server, endFunction : Function)
    {      
        this._id = uuidv4();
        this._room = this._id;
        this._server = server;
        this._endFunction = endFunction;
        let it = queue.entries();
        this._player1 = new Player(it.next().value, true);
        this._player2 = new Player(it.next().value, false);
        this._player1.getSocket().join(this._room);
        this._player2.getSocket().join(this._room);
        console.log(`Player 1 (user ${this._player1.getUser()} | socket ${this._player1.getSocket()}) and Player 2 (user ${this._player2.getUser()} | socket ${this._player2.getSocket()}) join the room`);
        this._ball = new Ball(false);
        this._state = States.PLAY;
        this._public = [];
        this._isEnded = false;
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

    public setState(state : States) {
        this._state = state;
    }

    public getPublic() : Socket[] {
        return this._public;
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

    public buildDataToReturn(message : string) : BroadcastObject {
        return ( {
        ball: {
            x : this._ball.getX(),
           // xp : number,
            y : this._ball.getY(),    
            //yp : number,
        },
        paddles: {
            ly: this._player1.getPaddle().getY(),
            lh: this._player1.getPaddle().getHeight(),
            //lyp : number,
            ry: this._player2.getPaddle().getY(),
            rh: this._player2.getPaddle().getHeight()
            //ryp: number, 
        },
        score: {
            p1: this._player1.getScore(),
            p2: this._player2.getScore()
        },
        state: this._state,
        message : message,
        });
    }
    
    public broadcastState(message : string) : void {
        const currentState = this.buildDataToReturn(message);
        this._server.to(this._room).emit('updateState', currentState);
    }

    public async play() : Promise<void> {
        this.getBall().updateBall(this);
        this.broadcastState("");
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
            this._state = States.PLAY;
            this.getPlayer1().getPaddle().reset();
            this.getPlayer2().getPaddle().reset();
            this._interval = setInterval(() => this.play(), Const.FPS);
            this.getPlayer1().setInterval((setInterval(() => this.getPlayer1().getPaddle().update(), Const.FPS))); 
            this.getPlayer2().setInterval((setInterval(() => this.getPlayer2().getPaddle().update(), Const.FPS))); 
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
/*
    public sendFinalResult(winner :Player, looser : Player)
    {
        const currentState = this.buildDataToReturn();
        console.log("Send final res...")
        winner.getSocket().emit('updateState', {...currentState, is_winner : true});
        looser.getSocket().emit('updateState', {...currentState, is_winner : false});
    }
*/
    public async stopMatch() : Promise<void>{
        this._state = States.OVER;
        this.broadcastState("Game Over")
        console.log(`player1 id : ${this._player1.getUser()} | player2 id : ${this._player2.getUser()}`);
        if (this._isEnded === false)
        {
        await this.saveMatch();
        this.removeAllSpectators();
        this.getPlayer1().disconnect(this._room);
        console.log(`---> Player 1 (${this.getPlayer1().getSocket().id}) left the room`);
        this.getPlayer2().disconnect(this._room);
        console.log(`--> Player 2 (${this.getPlayer2().getSocket().id}) left the room`);
        /*
        if(this.getPlayer1().IsWinner() === true)
            this.sendFinalResult( this.getPlayer1(), this.getPlayer2());
        else
            this.sendFinalResult( this.getPlayer2(), this.getPlayer1());
            */
        this._endFunction(this);
        this._isEnded = true;
        }
    
        
    }

    public async saveMatch() : Promise<void> {
        let winner = this._player1.getScore() === Const.MAX_SCORE? this._player1 : this._player2;
        let looser = this._player1.getScore() === Const.MAX_SCORE? this._player2 : this._player1;
        console.log(`winner id : ${winner.getUser()} | looser id : ${looser.getUser()}`)
        let match = { 
            winner: winner.getUser(),
            scoreWinner: winner.getScore(),
            looser: looser.getUser(),
            scoreLooser: looser.getScore(),
            date: Date.now()
        };
        await this.gameRepo.createEntity(match);
    }

    public addSpectator(client : Socket) : void
    {
        this._public.unshift(client);
        client.join(this._room);
    }

    public removeSpectator(client : Socket) : void
    {
        client.leave(this._room);
        this._public.splice(this._public.indexOf(client));
    }

    public removeAllSpectators() : void
    {
        while(this._public.length > 0)
            this.removeSpectator(this._public.pop());
    }

    public isPartOfPublic(client : Socket) : boolean
    {
        let index = this._public.indexOf(client);
        return index > -1 ? true : false;
    }

}