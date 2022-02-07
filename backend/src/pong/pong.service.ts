import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/createMatch.dto';
import { UpdateMatchDto } from './dto/updateMatch.dto';
import { Pong } from './entities/pong.entity';
import { Challenge } from './entities/challenge.entity';
import { Const } from './static/pong.constants';
import { CreateChallengeDto } from './dto/createChallenge.dto';

@Injectable()
export class PongService {
	constructor(
		@InjectRepository(Pong)
		private pongRepository: Repository<Pong>,
		@InjectRepository(Challenge)
		private challengeRepository: Repository<Challenge>,
	) {}

	// CHALLENGES

	async createChallenge(challenge: CreateChallengeDto) : Promise<number> {
		const newMatch = await this.challengeRepository.save(this.challengeRepository.create(challenge));
		return newMatch.id_challenge;
	}

	async deleteChallenge(id : number) {
		return await this.challengeRepository.delete(id);
	}

	async getChallengesToAnswer(user: User): Promise<Challenge[]> {
		return await this.challengeRepository.find({ 
			where :[{ challengee : {id : user.id}}],
			relations : ["challenger", "challengee"],
			order: { date : "ASC" },
		});
	}

	async getChallenge(id_challenge : number): Promise<Challenge> {
		return await this.challengeRepository.findOne({ 
			where :[ {id_challenge : id_challenge}],
			relations : ["challenger", "challengee"],
		});
	}

	// MATCHES
	
	async createMatch(match: CreateMatchDto) : Promise<number> {
		const newMatch = await this.pongRepository.save(this.pongRepository.create(match));
		return newMatch.id_match;
	}

	async updateMatch(id : number, match: UpdateMatchDto) {
		return await this.pongRepository.update(id, match);
	}

	async getMatchesOngoing(): Promise<Pong[]> {
		return await this.pongRepository.find({
			order: { date : "ASC" }, 
			relations: ["player1", "player2"],
			where : { status: "ongoing"} ,
	})}

	async getOneMatchOngoing(user: User): Promise<Pong> {
		return await this.pongRepository.findOne({
			where : [{ "player1" : { id : user.id} , status: "ongoing"} , { "player2" : { id : user.id}, status: "ongoing"}],
			relations: ["player1", "player2"],
		})
	}
	
	async getHistoryUser(user: User): Promise<Pong[]> {
		return await this.pongRepository.find({
			where :[{ player1 : { id : user.id} , status: "over"}, { player2: {id: user.id}, status: "over"} ],
			relations : ["player1", "player2"],
			order: { date : "ASC" },
		});
	}

	async getWinsUser(user: User): Promise<Number> {
		let wins =  await this.pongRepository.find( { 
			where :[{ player1 : {id: user.id}, scorePlayer1 : Const.MAX_SCORE}, { player2: {id: user.id}, scorePlayer2 : Const.MAX_SCORE}],
			relations : ["player1", "player2"],
			order: { date : "ASC" }
		});
		return (wins ? wins.length : 0);
	}

	async getLostUser(user: User): Promise<Number> {
		let lost= await this.pongRepository.find( {
			where :[{ player1 : {id: user.id}, scorePlayer2 : Const.MAX_SCORE}, { player2: {id: user.id}, scorePlayer1 : Const.MAX_SCORE}],
			relations : ["player1", "player2"],
			order: { date : "ASC" }
		});
		return (lost ? lost.length : 0);
	}

}