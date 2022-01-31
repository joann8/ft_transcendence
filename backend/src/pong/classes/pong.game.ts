import { Socket } from "socket.io";
import { States } from "../static/pong.states";
import { Ball } from "./pong.ball";
import { Player } from "./pong.player";
import { v4 as uuidv4} from "uuid";
import { Const } from "../static/pong.constants";
import { BroadcastObject } from "../static/pong.broadcastObject";
import { Server } from "socket.io";
import { PongService } from "../pong.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

export class Game {
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
    private _matchID : number;
    private _pongService : PongService;
    private _userService : UserService;
    
    constructor(queue: Map<Socket, User>, server : Server, endFunction : Function, pongService : PongService, userService: UserService)
    {      
        this._room = uuidv4();
        this._server = server;
        this._endFunction = endFunction;
        let it = queue.entries();
        this._player1 = new Player(it.next().value, true);
        this._player2 = new Player(it.next().value, false);
        this._player1.getSocket().join(this._room);
        this._player2.getSocket().join(this._room);
        this._ball = new Ball(false);
        this._state = States.PLAY;
        this._public = [];
        this._isEnded = false;
        this._interval = setInterval(() => this.play(), Const.FPS);
        this._pongService = pongService;
        this._userService = userService;
        this._matchID = -1;
        this.createMatch();
    }

    // Getters & Setters

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

    // Other Functions 

    public async createMatch () : Promise<void> {
        let match = {
            player1 : this._player1.getUser(),
            player2 : this._player2.getUser(),
            room: this._room,
        }
        this._matchID = await this._pongService.createEntity(match);
    }

    public hasWinner() : boolean {
        if (this._player1.isWinner() || this._player2.isWinner())
            return true;
        return false;
    }

    public buildDataToReturn() : BroadcastObject {
        return ( {
        ball: {
            x : this._ball.getX(),
            y : this._ball.getY(),    
        },
        paddles: {
            ly: this._player1.getPaddle().getY(),
            lh: this._player1.getPaddle().getHeight(),
            ry: this._player2.getPaddle().getY(),
            rh: this._player2.getPaddle().getHeight()
        },
        score: {
            p1: this._player1.getScore(),
            p2: this._player2.getScore()
        },
        players: {
            p1: this._player1.getUser().id_pseudo,
            p2: this._player2.getUser().id_pseudo
        },
        state: this._state,
        });
    }
    
    public broadcastState() : void {
        const currentState = this.buildDataToReturn();
        this._server.to(this._room).emit('updateState', currentState);
    }

    public play() : void {
        this.getBall().updateBall(this);
        this.broadcastState();
        if (this.hasWinner() === true) {
            clearInterval(this._interval);
            this.stopMatch();   
        }
    }

    public pauseAndScore(player : Player) : void {
        clearInterval(this._interval);
        clearInterval(this.getPlayer1().getInterval());
        clearInterval(this.getPlayer2().getInterval());
        player.setScore(player.getScore() + 1);
        this.getBall().reset();
        if (this.hasWinner() === false) {
            this.getPlayer1().getPaddle().reset();
            this.getPlayer2().getPaddle().reset();
            this._interval = setInterval(() => this.play(), Const.FPS);
            this.getPlayer1().setInterval((setInterval(() => this.getPlayer1().getPaddle().update(), Const.FPS))); 
            this.getPlayer2().setInterval((setInterval(() => this.getPlayer2().getPaddle().update(), Const.FPS))); 
        }
        else
            this.stopMatch();
    }

    public async disconnectPlayer(client : Socket) : Promise<void> {
        clearInterval(this._interval);
        if (client === this.getPlayer1().getSocket()) {
            this.getPlayer1().setScore(0);
            this.getPlayer2().setScore(Const.MAX_SCORE);
        }
        else {
            this.getPlayer2().setScore(0);
            this.getPlayer1().setScore(Const.MAX_SCORE);
        }
        await this.stopMatch();
    }

    public async stopMatch() : Promise<void> {
        this._state = States.OVER;
        this.broadcastState()
        if (this._isEnded === false) {
            this._isEnded = true;
            await this.saveMatch();
            this.removeAllSpectators();
            this.getPlayer1().disconnect(this._room);
            this.getPlayer2().disconnect(this._room);
            this._endFunction(this);
        }       
    }

    public async saveMatch() : Promise<void> {
        let winner = this._player1.getScore() === Const.MAX_SCORE? this._player1 : this._player2;
        let update = {
            scorePlayer1 : `${this._player1.getScore()}`,
            scorePlayer2 : `${this._player2.getScore()}`,
            status : `over`,
        }
        await this._userService.winElo(winner.getUser());
        await this._pongService.updateEntity(this._matchID, update);
    }

    public addSpectator(client : Socket) : void {
        this._public.unshift(client);
        client.join(this._room);
        this.broadcastState();
    }

    public removeSpectator(client : Socket) : void {
        client.leave(this._room);
        this._public.splice(this._public.indexOf(client));
    }

    public removeAllSpectators() : void {
        while(this._public.length > 0)
            this.removeSpectator(this._public.pop());
    }

    public isPartOfPublic(client : Socket) : boolean {
        let index = this._public.indexOf(client);
        return index > -1 ? true : false;
    }
}