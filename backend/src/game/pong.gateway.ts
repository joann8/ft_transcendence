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


// Interfaces = ways to describe objects

/*
@WebSocketGateway(3002, {
   // namespace: "/game",
    cors: { 
        origin:'*',
    },
})
*/

/*
@WebSocketGateway({namespace : "/game"})
*/

@WebSocketGateway( { namespace : "/game", cors: { origin:'*', },})

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    /* Juste si besoin de la reference */
    @WebSocketServer()
    server: Server;
    

    private logger: Logger = new Logger("*** Pong Interface ***");
    private clients: Set<Socket> = new Set(); // liste des clients ID
    private queue: Socket[] = []; // client dans la queue
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
        /*
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
            this.queue.splice(this.queue.indexOf(client));
        }
        */
    }

    // Fonctions de communications avec le front
    @SubscribeMessage('my_disconnect')
    async myDisconnect(client: Socket) : Promise <void> {
        this.logger.log(`MY DISCONNECT A client disconnected : ${client.id}`);
        this.disconnectClient(client);     
    }
    
    @SubscribeMessage('join_queue')
    async joinQueue(client: Socket) : Promise <void> {
        if (this.queue.indexOf(client) > -1)
            return;
        if (this.clients.has(client) === false)
            this.clients.add(client);
        this.logger.log(`Client ${client.id} joins the queue`);
        this.queue.unshift(client);
        this.logger.log(`queue length :  ${this.queue.length}`);
        if (this.queue.length > 1) {
            this.logger.log(`start a match!`);
            this.matchInit()
        }
        else
        {
            console.log("emit wait from server");
            client.emit('wait');
        }
    }
    
    @SubscribeMessage('down_paddle')
    async handleDownPaddle(@ConnectedSocket() client : Socket, direction : string): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
        {
            //console.log("PADDLE DOWN")
            match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().down():  match.getPlayer2().getPaddle().down();
        }
    }
    

    @SubscribeMessage('up_paddle')
    async handleUpPaddle(@ConnectedSocket() client : Socket, direction : string): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket() === client);
        if (match)
        {
            //console.log("PADDLE UP")
            match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().up():  match.getPlayer2().getPaddle().up();  
        }
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
         console.log("watch random received")
         console.log(`number of match on going : ${this.matches.length}`);
         if (this.matches.length > 0)
         {
             let index = Math.floor((Math.random() * (this.matches.length - 1)));
             this.matches[index].addSpectator(client);
         }
         else
         {
             console.log("no game")
 
             client.emit('no_current_match');
         }    
     }
 
     @SubscribeMessage('unwatch_game')
     async handleUnwatchGame(@ConnectedSocket() client : Socket): Promise<void> {
         if (this.matches.length > 0)
         {
             let index = Math.floor((Math.random() * (this.matches.length - 1)));
             this.matches[index].addSpectator(client);
         }
         else
         {
             client.emit('no_current_match');
         }    
     }
     
     // Fonctions du Back pour calculer les nouvelles positions, le status du jeu, etc.
 
     private matchInit() {
         let game = new Game(this.queue.pop(), this.queue.pop(), this.server, this.removeGame.bind(this));
         this.matches.unshift(game); // enregistrement du match
         this.logger.log(`new queue length after init :  ${this.queue.length}`);
 
     }
     
     private removeGame(game : Game) : void {
         let match = this.matches.find(item => item.getId() === game.getId());
         if (match)
         {
             console.log(`_____remove game ${game.getId()}`);
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
            this.queue.splice(this.queue.indexOf(client));
        }
     }
 };
 