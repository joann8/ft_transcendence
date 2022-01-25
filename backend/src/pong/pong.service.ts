import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
			order: { date : "ASC" } //DESC
		});
	}

	async getHistoryUser(id: string): Promise<Pong[]> {
		return await this.pongRepository.find({ 
			where :[{ winner : { id_pseudo : id}}, { looser: { id_pseudo : id}}],
			order: { date : "ASC" }
		});
	}

	async getWinsUser(id: string): Promise<Pong[]> {
		return await this.pongRepository.find( { 
			where : { winner: { id_pseudo : id}},
			order: { date : "ASC" }
		});
	}

	async getLostUser(id: string): Promise<Pong[]> {
		return await this.pongRepository.find( {
			where : { looser: { id_pseudo : id}},
			order: { date : "ASC" }
		});
	}

}
