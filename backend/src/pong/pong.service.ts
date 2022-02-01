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
import { UpdateChallengeDto } from './dto/updateChallenge.dto';

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

	async updateChallenge(id : number, challenge: UpdateChallengeDto) {
		return await this.challengeRepository.update(id, challenge);
	}

	async deleteChallenge(id : number) {
		return await this.challengeRepository.delete(id);
	}

	async getChallengesOnWait(user: User): Promise<Challenge[]> {
		return await this.challengeRepository.find({ 
			where :[{ player1 : user, status : "pending"}],
			relations : ["player1", "player2"],
			order: { date : "ASC" },
		});
	}

	async getChallengesToAnswer(user: User): Promise<Challenge[]> {
		return await this.challengeRepository.find({ 
			where :[{ player2 : user, status : "pending"}],
			relations : ["player1", "player2"],
			order: { date : "ASC" },
		});
	}

	async getChallengesPending(user: User): Promise<Challenge[]> {
		return await this.challengeRepository.find({ 
			where :[{ player1 : user}, { player2: user}],
			relations : ["player1", "player2"],
			order: { date : "ASC" },
		});
	}

	async getChallenge(challenger: User, challengee : User): Promise<Challenge> {
		return await this.challengeRepository.findOne({ 
			where :[{ player1 : challenger, player2: challengee}, { player1: challengee, player2: challenger}],
			relations : ["player1", "player2"],
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

	// On going Games

	async getMatchesOngoing(): Promise<Pong[]> {
		return await this.pongRepository.find({
			order: { date : "ASC" }, //DESC
			relations: ["player1", "player2"],
			where : { status: "ongoing"} ,
	})}
	
	// Games overs

	async getMatchesOver(): Promise<Pong[]> {
		return await this.pongRepository.find({
			order: { date : "ASC" }, //DESC
			relations: ["player1", "player2"],
			where : { status: "over"} ,
		});
	}

	async getHistoryUser(user: User): Promise<Pong[]> {
		return await this.pongRepository.find({
			where :[{ player1 : user, status: "over"}, { player2: user, status: "over"} ],
			relations : ["player1", "player2"],
			order: { date : "ASC" },
		});
	}

	async getWinsUser(user: User): Promise<Pong[]> {
		return await this.pongRepository.find( { 
			where :[{ player1 : user, scorePlayer1 : Const.MAX_SCORE}, { player2: user, scorePlayer2 : Const.MAX_SCORE}],
			relations : ["player1", "player2"],
			order: { date : "ASC" }
		});
	}

	async getLostUser(user: User): Promise<Pong[]> {
		return await this.pongRepository.find( {
			where :[{ player1 : user, scorePlayer2 : Const.MAX_SCORE}, { player2: user, scorePlayer1 : Const.MAX_SCORE}],
			relations : ["player1", "player2"],
			order: { date : "ASC" }
		});
	}
	
	/*
	async deleteOne(id: number): Promise<void> {
			await this.pongRepository.delete(id);
	}
	*/

}