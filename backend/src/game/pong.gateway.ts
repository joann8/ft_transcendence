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


@WebSocketGateway(3002, {
    cors: { 
        origin:'*',
    },
})

/*
@WebSocketGateway(3002, {
    namespace : '/game',
    cors: { 
        origin:'*',
    },
})
*/

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
        this.logger.log(`A client disconnected : ${client.id}`);
        let match = this.matches.find((game) => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket() === client );
        if (match)
        {
            console.log("HEEEEERE");
            match.disconnectPlayer(client);
           // this.clients.delete(match.getPlayer1().getSocket());      
           // this.clients.delete(match.getPlayer2().getSocket());      
           //  this.matches.splice(this.matches.indexOf(match));
        }
        else
        {
            console.log("There");
            this.clients.delete(client);
            this.queue.splice(this.queue.indexOf(client));
        }
    }

    // Fonctions de communications avec le front

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
    }
    
    @SubscribeMessage('down_paddle')
    async handleDownPaddle(@ConnectedSocket() client : Socket, direction : string): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
        {
            console.log("PADDLE DOWN")
            match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().down():  match.getPlayer2().getPaddle().down();
        }
    }
    

    @SubscribeMessage('up_paddle')
    async handleUpPaddle(@ConnectedSocket() client : Socket, direction : string): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket() === client);
        if (match)
        {
            console.log("PADDLE UP")
            match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().up():  match.getPlayer2().getPaddle().up();  
        }
     }
    
    /* optionnel 
    @SubscribeMessage('pause')
    handlePause(@ConnectedSocket() client : Socket, direction : string): void {
        let player = 
    }
    */
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
};

   