import { ConnectedSocket, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { MessageBody } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "socket.io";
import { OnGatewayConnection } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { StatsBase } from "fs";
import { v4 as uuidv4} from 'uuid';
import { Game } from "./classes/pong.game";
import { Const } from "./static/pong.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { Pong } from "./entities/pong.entity";
import { Repository } from "typeorm";
import { PongService } from "./pong.service";

@WebSocketGateway( { namespace : "/game", cors: { origin:'*', },})

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {     
    /* Juste si besoin de la reference */
    @WebSocketServer()
    server: Server;
    
    private logger: Logger = new Logger("*** Pong Interface ***");
    private clients: Set<Socket> = new Set(); // liste des clients ID
    private queue: Map<Socket, number> = new Map<Socket, number>(); // client dans la queue
    //private queue: Socket[] = [];
    private matches: Game[] = []; // liste des matches en cours

    afterInit(server: Server) {
        this.logger.log("Initialized!");
    }

    handleConnection(client: Socket) {
        this.logger.log(`New client connected : ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`HANDLE DISCONNECT A client disconnected : ${client.id}`);
        this.disconnectClient(client);
    }

    // Fonctions de communications avec le front
    @SubscribeMessage('my_disconnect')
    async myDisconnect(client: Socket) : Promise <void> {
        this.logger.log(`[ MY DISCONNECT received ] A client disconnected : ${client.id}`);
        this.disconnectClient(client);     
    }
    /*
    @SubscribeMessage('join_queue')
    async joinQueue(client: Socket, userID: number) : Promise <void> {
        if (this.queue.indexOf(client) > -1)
            return;
        if (this.clients.has(client) === false)
            this.clients.add(client);
        this.logger.log(`Client ${client.id} / userID ${userID} joins the queue`);
        this.queue.unshift(client);
        this.logger.log(`queue length :  ${this.queue.length}`);
        if (this.queue.length > 1) {
            this.logger.log(`start a match!`);
            this.matchInit()
        }
        else {
            console.log("emit wait from server");
            client.emit('wait');
        }
    }
    */
    @SubscribeMessage('join_queue')
    async joinQueue(client: Socket, userID: number) : Promise <void> {
        if (this.queue.has(client) === true)
            return;
        if (this.clients.has(client) === false)
            this.clients.add(client);
        this.logger.log(`Client ${client.id} / userID ${userID} joins the queue`);
        this.queue.set(client, userID);
        this.logger.log(`queue length :  ${this.queue.size}`);
        if (this.queue.size > 1) {
            this.logger.log(`start a match!`);
            this.matchInit()
        }
        else {
            console.log("emit wait from server");
            client.emit('wait');
        }
    }
    
    @SubscribeMessage('down_paddle')
    async handleDownPaddle(@ConnectedSocket() client : Socket, direction : string): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
            match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().down():  match.getPlayer2().getPaddle().down();
    }
    
    @SubscribeMessage('up_paddle')
    async handleUpPaddle(@ConnectedSocket() client : Socket, direction : string): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket() === client);
        if (match)
            match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().up():  match.getPlayer2().getPaddle().up();  
     }
    
     @SubscribeMessage('pause')
     async handlePause(@ConnectedSocket() client): Promise<void> {
         let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
         if (match)
         {
             match.getPlayer1().getSocket() === client? match.getPlayer1().pauseGame(match):  match.getPlayer2().pauseGame(match);
         }
     }
 
     @SubscribeMessage('resume')
     async handleResume(@ConnectedSocket() client): Promise<void> {
         let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
         if (match)
         {
             match.getPlayer1().getSocket() === client? match.getPlayer1().resumeGame(match):  match.getPlayer2().resumeGame(match);
         }
     }
 
     @SubscribeMessage('watch_random')
     async handleWatchRandom(@ConnectedSocket() client): Promise<void> {
         console.log("[ watch random received ]")
         console.log(`number of match on going : ${this.matches.length}`);
         if (this.matches.length > 0)
         {
             let index = Math.floor((Math.random() * (this.matches.length - 1)));
             this.matches[index].addSpectator(client);
             console.log(`Spectactor ${client.id} is now watching match ${this.matches[index].getId()}`);
         }
         else
         {
            console.log("no game")
            client.emit('no_current_match');
         }    
     }
 
     @SubscribeMessage('unwatch_game')
     async handleUnwatchGame(@ConnectedSocket() client : Socket): Promise<void> {
        console.log("[ unwatch game received ]")
        if (this.matches.length > 0)
         {
            for (let match of this.matches)
            {
                if(match.isPartOfPublic(client) === true)
                {
                    console.log(`Spectactor ${client.id} removed from match ${match.getId()}`);
                    match.removeSpectator(client);
                }
            }
        }
    }
     
    @SubscribeMessage('ball_on')
    async handleBallOn(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
        {
            match.getBall().setAccelerate(true);
            match.getPlayer1().getSocket() === client ? match.getPlayer2().getSocket().emit('ball_on_server') : match.getPlayer1().getSocket().emit('ball_on_server');
        }    
    }

    @SubscribeMessage('ball_off')
    async handleBallOff(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
        {
            match.getBall().setAccelerate(false);
            match.getPlayer1().getSocket() === client ? match.getPlayer2().getSocket().emit('ball_off_server') : match.getPlayer1().getSocket().emit('ball_off_server');
        }    
    }

    @SubscribeMessage('paddle_on')
    async handlePaddleOn(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
        {
           match.getPlayer1().getSocket() === client ? match.getPlayer1().getPaddle().enlargeOn() : match.getPlayer2().getPaddle().enlargeOn();
        }    
    }

    @SubscribeMessage('paddle_off')
    async handlePaddleOff(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
        {
           match.getPlayer1().getSocket() === client ? match.getPlayer1().getPaddle().enlargeOff() : match.getPlayer2().getPaddle().enlargeOff();
        }    
    }

     // Fonctions du Back pour calculer les nouvelles positions, le status du jeu, etc.
 
    /*
    private findMatch(client : Socket)
    {
        return this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
    }
    */

    private matchInit() {
        let game = new Game(this.queue, this.server, this.removeGame.bind(this));
        this.queue.clear();
        this.matches.unshift(game); // enregistrement du match
        //this.logger.log(`new queue length after init :  ${this.queue.length}`);
 
    }
    /*
    private matchInit() {
        let game = new Game(this.queue.pop(), this.queue.pop(), this.server, this.removeGame.bind(this));
        this.matches.unshift(game); // enregistrement du match
        //this.logger.log(`new queue length after init :  ${this.queue.length}`);
 
     }
     */
     private removeGame(game : Game) : void {
         let match = this.matches.find(item => item.getId() === game.getId());
         if (match)
         {
            //console.log(`_____remove game ${game.getId()}`);
            this.clients.delete(match.getPlayer1().getSocket());      
            this.clients.delete(match.getPlayer2().getSocket());      
            this.matches.splice(this.matches.indexOf(match));
         }
 
     }

     private disconnectClient(client : Socket)
     {
        let match = this.matches.find((game) => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket() === client );
        if (match)
        {
            match.disconnectPlayer(client);
            // this.clients.delete(match.getPlayer1().getSocket());      
           // this.clients.delete(match.getPlayer2().getSocket());      
           //  this.matches.splice(this.matches.indexOf(match));
        }
        else
        {
            this.clients.delete(client);
           // this.queue.splice(this.queue.indexOf(client));
            this.queue.delete(client);
        }
        //console.log("_______after disconnect__________")
        //console.log(this.queue);
        //console.log(this.matches);
        //console.log(this.clients);
     }
 };
 