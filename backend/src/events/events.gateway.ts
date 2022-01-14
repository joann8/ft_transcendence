import { ConnectedSocket, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { MessageBody } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "http";
import { OnGatewayConnection } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { StatsBase } from "fs";
import { v4 as uuidv4} from 'uuid';


// Interfaces = ways to describe objects

interface Ball {
    x: number;
    xp: number; // % pour le canvas de react?
    dx : number; //direction de x droite ou gauche
    y: number;
    yp: number;  // % pour le canvas de react?
    dy : number; //direction de y up or down
    speed : number;
}

interface Paddle {
    y: number;
    yp: number; // % pour le canvas de react?
    speed : number;
}

interface Player {
    socketId : Socket; 
    paddle: Paddle;
    score : number;
    is_winner : boolean; 
}

enum Status {
    WAIT, 
    PLAY, 
    PAUSE,
    OVER
}

interface Game {
    id : string; 
    player1 : Player;
    player2 : Player;
    ball: Ball;
    status : Status;
    maxScore : number;
}

interface Match {
    game : Game;
    interval : NodeJS.Timer; //type de fonction setTimeout, setInterval
}

// Constants du canvas
const width : number = 800;
const height : number = 600;
const paddle_h : number = height / 6;
const paddle_w : number = width / 80;
const ball_radius : number = 9;
const ball_speed : number = 10; // a reduire
const l_paddle_x: number = 5; //2?
const r_paddle_x: number = width - paddle_w - l_paddle_x; // pas sure
const paddle_init_y : number= (height / 2) - (paddle_h /2)
const paddle_speed : number = 10;
const maxScore : number = 10;
const FPS : number = 1000 / 30 // frame per second --> vitesse de broadcast


@WebSocketGateway(3002, {
    cors: { 
        origin:'*',
    },
})

export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    /*
    @WebSocketServer()
    server: Server;
    */

    private logger: Logger = new Logger("Match Interface -Gateway");
    private clients: Set<Socket> = new Set(); // liste des clients ID
    private queue: Socket[] = []; // client dans la queue
    private matches: Match[] = []; // liste des matches en cours

    afterInit(server: Server) {
        this.logger.log("Initialized!");
    }

    handleConnection(client: Socket) {
        this.logger.log(`new client connected : ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`a client disconnected : ${client.id}`);
        let index: number = this.queue.indexOf(client);
        if (index > -1)
        {
            let removeClient = this.queue.splice(index, 1);
            this.logger.log(`--> client removed from queue : ${removeClient[0]}`);
        
            // match disconnect
            let match = this.matches.find(item => item.game.player1.socketId === client || item.game.player2.socketId === client);
            if (match)
            {
                if (match.game.player1.socketId === client)
                {
                    match.game.player1.score = 0;
                    match.game.player2.score = match.game.maxScore;
                }
                else 
                {
                    match.game.player1.score = match.game.maxScore;
                    match.game.player2.score = 0;
                }
                this.stopMatch(match);
            }
        }
    }

    // Fonctions de communications avec le front

    @SubscribeMessage('join_queue')
    joinQueue(client: Socket) {
        if (this.clients.has(client))
            return; 
        this.clients.add(client);
        this.logger.log(`Client ${client} joins the queue`);
        this.queue.unshift(client);
        this.logger.log(`queue length :  ${this.queue.length}`);
        if (this.queue.length > 1) {
            this.logger.log(`start a match!`);
            this.matchInit()
        }
    }
    

    @SubscribeMessage('down_paddle')
    handleDownPaddle(@ConnectedSocket() client : Socket, direction : string): void {
        let match = this.matches.find(item => item.game.player1.socketId === client || item.game.player2.socketId === client);
        if (match)
            match.game.player1.socketId === client? this.updatePaddle(match.game.player1, 1) : this.updatePaddle(match.game.player2, 1);
    }
    

    
    @SubscribeMessage('up_paddle')
    handleUpPaddle(@ConnectedSocket() client : Socket, direction : string): void {
        let match = this.matches.find(item => item.game.player1.socketId === client || item.game.player2.socketId === client);
        if (match)
            match.game.player1.socketId === client? this.updatePaddle(match.game.player1, -1) : this.updatePaddle(match.game.player2, -1);    
    }
    

    /* optionnel 
    @SubscribeMessage('pause')
    handlePause(@ConnectedSocket() client : Socket, direction : string): void {
        let player = 
    }
    */



    // Fonctions du Back pour calculer les nouvelles positions, le status du jeu, etc.

    private matchInit() {

        let paddle1 : Paddle = {
            y : paddle_init_y,
            yp : 0.5,
            speed : paddle_speed
        };
        let paddle2 : Paddle = {
            y : paddle_init_y,
            yp : 0.5,
            speed : paddle_speed
        };

        let player1 :  Player = {
            socketId : this.queue.pop(),
            paddle : paddle1,
            score : 0,
            is_winner : false
        }

        let player2 :  Player = {
            socketId : this.queue.pop(),
            paddle : paddle2,
            score : 0,
            is_winner : false
        }
        let ball : Ball = {
            x: width / 2,
            xp: 0.5,
            dx : 1,
            //dx : Math.random() > 0.5? 1 : -1, 
            y: height / 2,
            yp: 0.5,
            dy : 1,
            //dy : Math.random() > 0.5? 1 : -1, 
            speed : ball_speed,
        }

        let game : Game = {
            id : uuidv4(),
            player1 : player1,
            player2 : player2,
            ball: ball,
            status : Status.PLAY,
            maxScore : maxScore,
        }
        let match : Match = {
            game : game,
            interval : setInterval(()=> this.gameOn(game), FPS)
        }
        this.matches.unshift(match); // enregistrement du match
        this.gameOn(game)
    }
    
    private gameOn(game : Game)
    {
         if (this.updateBall(game) === 1) // si jamais colision
            this.resetGame(game);
        this.checkWinner(game);
        this.broadcastMatch(game);
        if (game.status === Status.OVER)
        {
            let match = this.matches.find(item => item.game.id === game.id);
            this.stopMatch(match);
        }
    }

    private resetGame(game : Game)
    {
        game.ball = {
            x: width / 2,
            xp: 0.5,
           // dx : Math.random() > 0.5? 1 : -1, 
            dx : 1,

            y: height / 2,
            yp: 0.5,
        //    dy : Math.random() > 0.5? 1 : -1,
            dy : 1,

            speed : ball_speed
        }

        game.player1.paddle = {
            y : paddle_init_y,
            yp : 0.5,
            speed : paddle_speed
        };

        game.player2.paddle = {
            y : paddle_init_y,
            yp : 0.5,
            speed : paddle_speed
        };
    }

    private async scoreWait()
    {
        await new Promise (resolve => setTimeout(resolve, 2000));
    }
    
    private updatePaddle(player : Player, direction : number) // up == -1
    {
        let newY = player.paddle.y + (player.paddle.speed * direction);
        if (newY + paddle_h > height || newY < 0)
            player.paddle.y =  newY < 0 ? 0 : height - paddle_h;
        else
            player.paddle.y  = newY;
    }

    private updateBall(game : Game)
    {
        let newX = game.ball.x + (game.ball.speed * game.ball.dx);
        //Collision X = Paddle a rajouter
        if (newX + ball_radius > width || newX < ball_radius)
        {
            /*
            newX < width ? game.player2.score += 1 : game.player1.score += 1;
            this.scoreWait();
            return (1);
            */
            if (newX < ball_radius)
                game.ball.x = ball_radius;
            else
                game.ball.x =  width - ball_radius;
            game.ball.dx = -game.ball.dx;
        }
        else
            game.ball.x = newX;

        let newY = game.ball.y + (game.ball.speed * game.ball.dy);
        // Collision Y
        if (newY + ball_radius > height || newY < ball_radius)
        {
            if (newY < ball_radius)
                game.ball.y =  ball_radius;
            else
                game.ball.y = height - ball_radius;
            game.ball.dy = -game.ball.dy;
        }
        else
            game.ball.y = newY;
        return (0);
    }
 
    private checkWinner(game : Game)
    {
        if (game.player1.score === game.maxScore)
        {
            game.status === Status.OVER;
            game.player1.is_winner = true;
        }
        else if (game.player2.score === game.maxScore)
        {
            game.status === Status.OVER;
            game.player1.is_winner = true;
        }
    }

    // Broadcast game to players
    private broadcastMatch(game : Game)
    {
        const updateState = {
            ball: {
                x : game.ball.x,
                //xp
                y : game.ball.y    
                //yp
            },
            paddles: {
                ly: game.player1.paddle.y,
                ry: game.player2.paddle.y
            },
            score: {
                p1: game.player1.score,
                p2: game.player2.score
            },
            state: game.status,
        }
        game.player1.socketId.emit('updateState', {...updateState, is_winner : game.player1.is_winner});
        game.player2.socketId.emit('updateState', {...updateState, is_winner : game.player2.is_winner});
    }

    private stopMatch(match : Match)
    {
        this.broadcastMatch(match.game);
        clearInterval(match.interval);
        this.matches.splice(this.matches.indexOf(match), 1);
        this.queue.splice(this.queue.indexOf(match.game.player1.socketId), 1);
        this.queue.splice(this.queue.indexOf(match.game.player2.socketId), 1);
        this.clients.delete(match.game.player1.socketId);
        this.clients.delete(match.game.player2.socketId);
    }
};

   