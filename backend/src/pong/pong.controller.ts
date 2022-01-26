import {
	Controller,
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
	@Get('all')
	async getMatches() : Promise<Pong[]> {
		return this.pongService.getMatches();
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
}
