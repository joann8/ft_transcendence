import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/createMatch.dto';
import { UpdateMatchDto } from './dto/updateMatch.dto';
import { Pong } from './entities/pong.entity';
import { Const } from './static/pong.constants';

@Injectable()
export class PongService {
	constructor(
		@InjectRepository(Pong)
		private pongRepository: Repository<Pong>,
	) {}

	async createEntity(match: CreateMatchDto) : Promise<number> {
		const newMatch = await this.pongRepository.save(this.pongRepository.create(match));
		return newMatch.id_match;
	}

	async updateEntity(id : number, match: UpdateMatchDto) {
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

}