import { Socket } from "socket.io";
import { User } from "src/user/entities/user.entity";

export class Challenge {
    private _id_challenge : number;
    private _challenger: User;
    private _challenger_socket: Socket;
    private _challengee : User;
    
    constructor(id_challenge : number, challenger : User, challenger_socket : Socket, challengee : User)
    {      
        this._id_challenge = id_challenge;
        this._challenger = challenger;
        this._challenger_socket = challenger_socket;
        this._challengee = challengee;
    }

    public getId() : number {
        return this._id_challenge; 
    }

    public getChallenger() :  User {
        return this._challenger; 
    }

    public getChallengerSocket() :  Socket {
        return this._challenger_socket; 
    }

    public getChallengee() :  User {
        return this._challengee; 
    }
}
    