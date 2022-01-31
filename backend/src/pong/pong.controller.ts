import {
	Controller,
	Delete,
	Get,
	Param,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Pong } from './entities/pong.entity';
import { ParsePseudoPipe } from './pipe/parse-pseudo-pipe';
import { PongService } from './pong.service';

@Controller('game')
export class PongController {
	constructor(private readonly pongService: PongService) {}
	
	//get all matches
	@Get('over')
	async getMatchesOver() : Promise<Pong[]> {
		return this.pongService.getMatchesOver();
	}

	@Get('ongoing')
	async getMatchesOngoing() : Promise<Pong[]> {
		return this.pongService.getMatchesOngoing();
	}
	// get all Matches for a user
	@Get('history/:id')
	async getHistory(@Param('id', ParsePseudoPipe) user: User): Promise<Pong[]> {
		return this.pongService.getHistoryUser(user);
	}
	
	// get all Wins for a user
	@Get('wins/:id')
	async getWins(@Param('id', ParsePseudoPipe) user: User): Promise<Pong[]> {
		return this.pongService.getWinsUser(user);
	}

	// get all Lost for a user
	@Get('lost/:id')
	async getLost(@Param('id', ParsePseudoPipe) user: User): Promise<Pong[]> {
		return this.pongService.getLostUser(user);
	}

	/*
	@Delete('ongoing/:id')
	async deleteOne(@Param('id') id: number): Promise<void> {
		return this.pongService.deleteOne(id);
	}
	*/
}
