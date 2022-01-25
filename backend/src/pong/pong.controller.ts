import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Req,
	Put,
	Redirect,
	ParseIntPipe,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/createMatch.dto';
import { Pong } from './entities/pong.entity';
import { PongService } from './pong.service';

@Controller('game')
export class PongController {
	constructor(private readonly pongService: PongService) {}
	// GET all matches
	@Get('all')
	async getMatches() : Promise<Pong[]> {
		return this.pongService.getMatches();
	}
	// get Matches for another user
	@Get('history/:id')
	async getHistory(@Param('id') id: string): Promise<Pong[]> {
		return this.pongService.getHistoryUser(id);
	}
	
	@Get('wins/:id')
	async getWins(@Param('id') id: string): Promise<Pong[]> {
		return this.pongService.getWinsUser(id);
	}

	@Get('lost/:id')
	async getLost(@Param('id') id: string): Promise<Pong[]> {
		return this.pongService.getLostUser(id);
	}
}
