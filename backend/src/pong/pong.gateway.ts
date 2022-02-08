import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { Game } from "./classes/pong.game";
import { PongService } from "./pong.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Challenge } from "./classes/pong.challenge";

@WebSocketGateway( { namespace : "/game", cors: { origin: '*'}}) 
//cors: { origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_BIS],
//        credentials: true,},}) // CORS A REVOIR

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {  
    constructor( private userService : UserService, private pongService : PongService) {}

    @WebSocketServer()
    server: Server;
    
    private logger: Logger = new Logger("*** Pong Interface ***");
    private queue: Map<Socket, User> = new Map<Socket, User>(); // clients dans la queue
    private matches: Game[] = []; // liste des matches en cours
    private challenges: Challenge[] = []; // liste des matches en cours

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

    // Verifie si le joeur est deja dans une queue / dans un match / dans un challenge
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
        let challenge = this.challenges.find(challenge => challenge.getChallenger().id === userID.id)
        if (challenge) {
            client.emit('not_allowed_playing');
            return;
        }
        client.emit('allowed'); 
    }

    // Fonctions pour jouer RANDOM

    @SubscribeMessage('join_queue')
    async joinQueue(client: Socket, userID: User) : Promise <void> {
        if (this.queue.has(client) === true)    
            return;  
        this.queue.set(client, userID);
        if (this.queue.size > 1)
            this.matchInit(this.queue)
    }

    @SubscribeMessage('my_disconnect')
    async myDisconnect(client: Socket) : Promise <void> {
        this.disconnectClient(client);     
    }  

    // Fonctions pour jouer CHALLENGE
  
    @SubscribeMessage('create_challenge')
    async createChallenge(client: Socket, info : {challenger: User, challengee : User}) : Promise <void> {
        let challenge1 = {
            challenger : info.challenger,
            challengee : info.challengee,
        }
        let id_challenge = await this.pongService.createChallenge(challenge1);
        let challenge2 = new Challenge(id_challenge, info.challenger, client, info.challengee);
        this.challenges.unshift(challenge2); // enregistrement du challenge
    }

    @SubscribeMessage('answer_challenge')
    async answerChallenge(client: Socket, info : { id_challenge : number, answer : string}) : Promise <void> {
        let challenge =  this.challenges.find(challenge => challenge.getId() === info.id_challenge);
        if (challenge) {
            if (info.answer === "accepted") {
                challenge.getChallengerSocket().emit("challenge_accepted", challenge.getId());
                let binome : Map<Socket, User> = new Map<Socket, User>(); 
                binome.set(challenge.getChallengerSocket(), challenge.getChallenger());
                binome.set(client, challenge.getChallengee());
                this.matchInit(binome);                
            }
            else
                challenge.getChallengerSocket().emit("challenge_refused", challenge.getId());
            await this.pongService.deleteChallenge(info.id_challenge);
            this.challenges.splice(this.challenges.indexOf(challenge));
        }
        else
            client.emit('no_such_challenge');
    }

    @SubscribeMessage('cancel_challenge')
    async cancelChallenge(client: Socket, info : {challenger: User, challengee : User}) : Promise <void> {
        let challenge =  this.challenges.find(challenge => (challenge.getChallenger().id === info.challenger.id && challenge.getChallengee().id === info.challengee.id));
        if (challenge) {
            await this.pongService.deleteChallenge(challenge.getId());
            this.challenges.splice(this.challenges.indexOf(challenge));
        }
    }
    
    // MOUVEMENTS RAQUETTES

    @SubscribeMessage('down_paddle')
    async handleDownPaddle(@ConnectedSocket() client : Socket): Promise<void> {
        let match = this.matches.find(game => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket()=== client);
        if (match)
            match.getPlayer1().getSocket() === client? match.getPlayer1().getPaddle().down():  match.getPlayer2().getPaddle().down();
    }
    
    @SubscribeMessage('up_paddle')
    async handleUpPaddle(@ConnectedSocket() client : Socket): Promise<void> {
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
        match ? client.emit('allowed_watch', room) : client.emit('not_allowed_watch');
    }

    @SubscribeMessage('watch_game')
    async handleListGames(client : Socket, room : string): Promise<void> {
        let match = this.matches.find(game => game.getRoom() === room);
        if (match)
            match.addSpectator(client);
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
        game.getPlayer1().getSocket().emit("start_game");
        game.getPlayer2().getSocket().emit("start_game");
        this.queue.delete(game.getPlayer1().getSocket());
        this.queue.delete(game.getPlayer2().getSocket());
        this.matches.unshift(game); // enregistrement du match
    }

    private removeGame(game : Game) : void {
        let match = this.matches.find(item => item.getRoom() === game.getRoom());
        if (match) {
            this.checkAchievement(match.getPlayer1().getUser());
            this.checkAchievement(match.getPlayer2().getUser());
            this.matches.splice(this.matches.indexOf(match));
        }
    }

    // Deconnexion des matchs (challenge pending pris en charge dans cancel challenge)
    private disconnectClient(client : Socket) {
        let match = this.matches.find((game) => game.getPlayer1().getSocket() === client || game.getPlayer2().getSocket() === client );
        match ? match.disconnectPlayer(client) : this.queue.delete(client);
    }

    // Check achievements
    private async checkAchievement(user : User) : Promise<void> {
        let nb1 = await this.pongService.getMaxUser(user);
        let nb2 = await this.pongService.getWinsUser(user);
        if(nb1 >= 1) {// if user won at least one time with max Score
            let update1 = { achievement1: true};
            this.userService.update(user.id, update1);
        }
        if (nb2 >= 3) { // if user won at least 3 games
            let update2 = { achievement2: true};
            this.userService.update(user.id, update2);
        }
    }
}