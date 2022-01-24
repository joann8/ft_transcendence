import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/createMatch.dto';
import { Pong } from './entities/pong.entity';

@Injectable()
export class PongService {
	constructor(
		@InjectRepository(Pong)
		private pongRepository: Repository<Pong>,
	) {}

	async createEntity(match: CreateMatchDto) {
		try {
			console.log(match);
			const newMatch = await this.pongRepository.create(match); // add match ID
			await this.pongRepository.save(newMatch);
			return newMatch;
		} catch (error) {
			throw error;
		}
	}

	async getMatches(): Promise<Pong[]> {
		return await this.pongRepository.find({
			order: { date : "ASC" } //DESC
		});
	}

	async getMatchesUser(id: number): Promise<Pong[]> {
		return await this.pongRepository.find({ 
			where :[{ winner : id}, { looser : id}],
			order: { date : "ASC" }
		});
	}

	async getWinsUser(id: number): Promise<Pong[]> {
		return await this.pongRepository.find( { 
			where : { winner : id},
			order: { date : "ASC" }
		});
	}

	async getLostUser(id: number): Promise<Pong[]> {
		return await this.pongRepository.find( {
			where : { looser : id},
			order: { date : "ASC" }
		});
	}

}
