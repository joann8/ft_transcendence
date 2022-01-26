import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/createMatch.dto';
import { Pong } from './entities/pong.entity';

@Injectable()
export class PongService {
	constructor(
		@InjectRepository(Pong)
		private pongRepository: Repository<Pong>
	) {}

	async createEntity(match: CreateMatchDto) : Promise<Pong> {
		const newMatch = this.pongRepository.create(match);
		await this.pongRepository.save(newMatch);
		console.log(newMatch);
		return newMatch;
	}

	async getMatches(): Promise<Pong[]> {
		return await this.pongRepository.find({
			order: { date : "ASC" }, //DESC
			relations: ["winner", "looser"]
		});
	}

	async getHistoryUser(user: User): Promise<Pong[]> {
		return await this.pongRepository.find({ 
			where :[{ winner : user}, { looser: user}],
			relations : ["winner", "looser"],
			order: { date : "ASC" }
		});
	}

	async getWinsUser(user: User): Promise<Pong[]> {
		return await this.pongRepository.find( { 
			where : { winner: user},
			relations : ["winner", "looser"],
			order: { date : "ASC" }
		});
	}

	async getLostUser(user: User): Promise<Pong[]> {
		return await this.pongRepository.find( {
			where : { looser: user},
			relations : ["winner", "looser"],
			order: { date : "ASC" }
		});
	}

}
