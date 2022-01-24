import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Req,
	Put,
	Redirect,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/createMatch.dto';
import { Pong } from './entities/pong.entity';
import { PongService } from './pong.service';

@Controller()
export class PongController {
	constructor(private readonly pongService: PongService) {}
	// GET all matches
	@Get('game/all')
	async getMatches() : Promise<Pong[]> {
		return this.pongService.getMatches();
	}

	// get Matches for the current user
	@Get('game/history')
	async getHistory(@Req() req): Promise<Pong[]> {
		return this.pongService.getMatchesUser(req.Id);
	}

	@Get('game/history/:id')
	async getHistoryOther(@Param() userId: number): Promise<Pong[]> {
		return this.pongService.getMatchesUser(userId);
	}

	@Get('user/wins')
	async getWins(@Req() req): Promise<Pong[]> {
		return this.pongService.getWinsUser(req.Id);
	}

	@Get('user/lost')
	async getLost(@Req() req): Promise<Pong[]> {
		return this.pongService.getLostUser(req.Id);
	}

	@Put()
	async createMatch(@Param() createMatch: CreateMatchDto) :  Promise<Pong> {
		return this.pongService.createEntity(createMatch);
	}
}
