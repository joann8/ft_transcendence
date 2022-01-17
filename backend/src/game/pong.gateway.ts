import { ConnectedSocket, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { MessageBody } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "http";
import { OnGatewayConnection } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { StatsBase } from "fs";
import { v4 as uuidv4} from 'uuid';
import { Game } from "./classes/pong.game";
import { Const } from "./static/pong.constants";


// Interfaces = ways to describe objects

@WebSocketGateway(3002, {
    namespace : '/game',
    cors: { 
        origin:'*',
    },
})

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    /* Juste si besoin de la reference
    @WebSocketServer()
    server: Server;
    */

    private logger: Logger = new Logger("*** Pong Interface ***");
    private clients: Set<Socket> = new Set(); // liste des clients ID
    private queue: Socket[] = []; // client dans la queue
    private matches: Game[] = []; // liste des matches en cours


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
            let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
            if (match)
            {
                if (match.getPlayer1().getSocket() === client)
                {
                    match.getPlayer1().setScore(0);
                    match.getPlayer2().setScore(Const.MAX_SCORE);
                }
                else 
                {
                    match.getPlayer2().setScore(0);
                    match.getPlayer1().setScore(Const.MAX_SCORE);
                }
                this.stopMatch(match);
            }
        }
    }

    // Fonctions de communications avec le front

    @SubscribeMessage('join_queue')
    async joinQueue(client: Socket) : Promise <void> {
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
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
            match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().down():  match.getPlayer2().getPaddle().down();
    }
    

    
    @SubscribeMessage('up_paddle')
    async handleUpPaddle(@ConnectedSocket() client : Socket, direction : string): Promise<void> {
        let match = this.matches.find(item => item.game.player1.socketId === client || item.game.player2.socketId === client);
        if (match)
        match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().up():  match.getPlayer2().getPaddle().up();    }
    

    /* optionnel 
    @SubscribeMessage('pause')
    handlePause(@ConnectedSocket() client : Socket, direction : string): void {
        let player = 
    }
    */



    // Fonctions du Back pour calculer les nouvelles positions, le status du jeu, etc.

    private matchInit() {

        let game = new Game(player1, player2);
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


    private async scoreWait()
    {
        await new Promise (resolve => setTimeout(resolve, 2000));
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

   