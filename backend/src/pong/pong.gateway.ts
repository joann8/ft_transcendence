import { ConnectedSocket, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "socket.io";
import { OnGatewayConnection } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Game } from "./classes/pong.game";
import { PongService } from "./pong.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@WebSocketGateway( { namespace : "/game", cors: { origin:'*', },})

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {  
    constructor( private userService : UserService, private pongService : PongService) {}
    /* Juste si besoin de la reference */
    @WebSocketServer()
    server: Server;
    
    private logger: Logger = new Logger("*** Pong Interface ***");
    private clients: Set<Socket> = new Set(); // liste des clients ID
    private queue: Map<Socket, User> = new Map<Socket, User>(); // client dans la queue
    private matches: Game[] = []; // liste des matches en cours
    private challenges: Map<User, User> = new Map<User, User>(); // liste des defis

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

    @SubscribeMessage('check_game')
    async checkGame(client: Socket, userID: User) : Promise <void> {
        let match = this.matches.find(game => game.getPlayer1().getUser().id === userID.id || game.getPlayer2().getUser().id === userID.id);
        if (match) {
            client.emit('not_allowed_playing');
            return;
        }
        let it = this.queue.values();
        let it2 = this.queue.values();
        for(let i = 0; i < this.queue.size; i++)
        {
            console.log(`it2 = ${it2.next().value.id}`)
            if (it.next().value.id === userID.id) {
                client.emit('not_allowed_queue');
                return;
            }
        }
        client.emit('allowed');
    }

    @SubscribeMessage('join_queue')
    async joinQueue(client: Socket, userID: User) : Promise <void> {
        console.log(`user ID received : ${userID.id_pseudo}`)
        if (this.queue.has(client) === true)    
            return;
        if (this.clients.has(client) === false)
            this.clients.add(client);       
        this.logger.log(`Client ${client.id} / userID ${userID.id_pseudo} joins the queue`);
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
    /* Besoin validation dans chat pour arriver a la page avec direct les deux clients et socket */
    /*
    @SubscribeMessage('defy')
    async defy(client: Socket, userID: User, friend : User) : Promise <void> {
        //check game fait d'abord --> ni dans un match, ni dans la queue
        if (this.challenges.has(userID)) {
            client.emit('already_defying');
            return;
        }
        this.logger.log(`userID ${userID.id_pseudo} defy ${friend.id_pseudo}`);
        this.challenges.set(userID, friend);
        else {
            console.log("emit wait DEFY from server");
            client.emit('wait');
        }
    }
    */ 
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
    /*
     @SubscribeMessage('pause')
     async handlePause(@ConnectedSocket() client): Promise<void> {
         let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
         if (match)
             match.getPlayer1().getSocket() === client? match.getPlayer1().pauseGame(match):  match.getPlayer2().pauseGame(match);
     }
 
     @SubscribeMessage('resume')
     async handleResume(@ConnectedSocket() client): Promise<void> {
         let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
         if (match) {
             match.getPlayer1().getSocket() === client? match.getPlayer1().resumeGame(match):  match.getPlayer2().resumeGame(match);
         }
     }
     */

    @SubscribeMessage('watch_game')
    async handleListGames(client : Socket, room : string): Promise<void> {
        //console.log("[ watch_game  received ] : ", room)
        let match = this.matches.find(game => game.getRoom() === room);
        if (match) {
            match.addSpectator(client);
            //console.log(`Spectactor ${client.id} is now watching match ${match.getPlayer1().getUser().id_pseudo} VS ${match.getPlayer2().getUser().id_pseudo}`);
        }
        else
            client.emit('match_over');
    }
    
    @SubscribeMessage('unwatch_game')
    async handleUnwatchGame(@ConnectedSocket() client : Socket): Promise<void> {
        //console.log("[ unwatch game received ]")
        if (this.matches.length > 0) {
            for (let match of this.matches) {
                if(match.isPartOfPublic(client) === true) {
                    //console.log(`Spectactor ${client.id} removed from match ${match.getId()}`);
                    match.removeSpectator(client);
                }
            }
        }
    }
     
    @SubscribeMessage('ball_on')
    async handleBallOn(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match) {
            match.getBall().setAccelerate(true);
            match.getPlayer1().getSocket() === client ? match.getPlayer2().getSocket().emit('ball_on_server') : match.getPlayer1().getSocket().emit('ball_on_server');
        }    
    }

    @SubscribeMessage('ball_off')
    async handleBallOff(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match) {
            match.getBall().setAccelerate(false);
            match.getPlayer1().getSocket() === client ? match.getPlayer2().getSocket().emit('ball_off_server') : match.getPlayer1().getSocket().emit('ball_off_server');
        }    
    }

    @SubscribeMessage('paddle_on')
    async handlePaddleOn(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
           match.getPlayer1().getSocket() === client ? match.getPlayer1().getPaddle().enlargeOn() : match.getPlayer2().getPaddle().enlargeOn();
    }

    @SubscribeMessage('paddle_off')
    async handlePaddleOff(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
           match.getPlayer1().getSocket() === client ? match.getPlayer1().getPaddle().enlargeOff() : match.getPlayer2().getPaddle().enlargeOff();
    }

     // Fonctions du Back pour calculer les nouvelles positions, le status du jeu, etc.
 
    /*
    private findMatch(client : Socket)
    {
        return this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
    }
    */

    private matchInit() {
        let game = new Game(this.queue, this.server, this.removeGame.bind(this), this.pongService, this.userService);
        // A verifier
        this.queue.delete(game.getPlayer1().getSocket());
        this.queue.delete(game.getPlayer2().getSocket());
        this.matches.unshift(game); // enregistrement du match
    }
    
     private removeGame(game : Game) : void {
        let match = this.matches.find(item => item.getRoom() === game.getRoom());
         if (match) {
            this.clients.delete(match.getPlayer1().getSocket());      
            this.clients.delete(match.getPlayer2().getSocket());      
            this.matches.splice(this.matches.indexOf(match));
        }
    }

    private disconnectClient(client : Socket) {
        let match = this.matches.find((game) => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket() === client );
        if (match)
            match.disconnectPlayer(client);
        else {
            this.clients.delete(client);
            this.queue.delete(client);
        }
    }
 };
 