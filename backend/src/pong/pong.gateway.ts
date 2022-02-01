import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { Game } from "./classes/pong.game";
import { PongService } from "./pong.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@WebSocketGateway( { namespace : "/game", cors: { origin:'*', },}) // CORS A REVOIR

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {  
    constructor( private userService : UserService, private pongService : PongService) {}

    @WebSocketServer()
    server: Server;
    
    private logger: Logger = new Logger("*** Pong Interface ***");
    private clients: Set<Socket> = new Set(); // liste des clients ID
    private queue: Map<Socket, User> = new Map<Socket, User>(); // client dans la queue
    private matches: Game[] = []; // liste des matches en cours
   // private challenges: Map<User, User> = new Map<User, User>(); // liste des defis

    // Fonctions de base

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

    // Fonctions pour jouer RANDOM

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
        for(let i = 0; i < this.queue.size; i++) {
            if (it.next().value.id === userID.id) {
                client.emit('not_allowed_queue');
                return;
            }
        }
        client.emit('allowed');
    }

    @SubscribeMessage('join_queue')
    async joinQueue(client: Socket, userID: User) : Promise <void> {
        //console.log(`user ID received : ${userID.id_pseudo}`)
        if (this.queue.has(client) === true)    
            return;
        if (this.clients.has(client) === false)
            this.clients.add(client);       
        //this.logger.log(`Client ${client.id} / userID ${userID.id_pseudo} joins the queue`);
        this.queue.set(client, userID);
        //this.logger.log(`queue length :  ${this.queue.size}`);
        if (this.queue.size > 1) {
            //this.logger.log(`start a match!`);
            this.matchInit(this.queue)
        }
    }

    // Fonctions pour jouer DUEL

    /* Besoin validation dans chat pour arriver a la page avec direct les deux clients et socket */
    //check_game
   
    @SubscribeMessage('create_challenge')
    async createChallenge(client: Socket, challenger: User, challengee : User) : Promise <void> {
        let challenge = {
            challenger : challenger,
            challenger_socket : client,
            challengee : challengee,
            status: "pending",
        }
        await this.pongService.createChallenge(challenge);
    }

    @SubscribeMessage('answer_challenge')
    async answerChallenge(client: Socket, challengee: User, challenger : User, answer : string) : Promise <void> {
        const challenge = await this.pongService.getChallenge(challenger, challengee);
        if (challenge) {
            if (answer === "accepted")
            {
                challenge.challenger_socket.emit("challenge_accepted", challenge.id_challenge);
                let binome : Map<Socket, User> = new Map<Socket, User>(); // client dans la queue
                binome.set(challenge.challenger_socket, challenge.challenger);
                binome.set(client, challenge.challengee);
                this.matchInit(binome);                
            }
            else
                challenge.challenger_socket.emit("challenge_refused", challenge.id_challenge);
            await this.pongService.deleteChallenge(challenge.id_challenge);
        }
    }
    
    // MOUVEMENTS RAQUETTES

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


    // OPTIONS DU JEU
     
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

    // MODE SPECTATEUR

    @SubscribeMessage('check_match')
    async checkMatch(client: Socket, room : string) : Promise <void> {
        let match = this.matches.find(game => game.getRoom() === room);
        if (match)
            client.emit('allowed_watch', room);
        else
            client.emit('not_allowed_watch');
    }

    @SubscribeMessage('watch_game')
    async handleListGames(client : Socket, room : string): Promise<void> {
        let match = this.matches.find(game => game.getRoom() === room);
        if (match) {
            match.addSpectator(client);
        }
    }
    
    @SubscribeMessage('unwatch_game')
    async handleUnwatchGame(@ConnectedSocket() client : Socket): Promise<void> {
        if (this.matches.length > 0) {
            for (let match of this.matches) {
                if(match.isPartOfPublic(client) === true) {
                    match.removeSpectator(client);
                }
            }
        }
    }

    // Fonctions du Back pour calculer les nouvelles positions, le status du jeu, etc.
 
    private matchInit(source : Map<Socket, User>) {
        let game = new Game(source, this.server, this.removeGame.bind(this), this.pongService, this.userService);
        // A verifier
        this.queue.delete(game.getPlayer1().getSocket());
        this.queue.delete(game.getPlayer2().getSocket());
        this.matches.unshift(game); // enregistrement du match
    }

    private removeGame(game : Game) : void {
        let match = this.matches.find(item => item.getRoom() === game.getRoom());
         if (match) {
            //this.clients.delete(match.getPlayer1().getSocket());      
            //this.clients.delete(match.getPlayer2().getSocket());      
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
}