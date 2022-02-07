import { Controller,	Get, HttpException,	HttpStatus, Param, Req} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Challenge } from './entities/challenge.entity';
import { Pong } from './entities/pong.entity';
import { ParsePseudoPipe } from './pipe/parse-pseudo-pipe';
import { PongService } from './pong.service';

@Controller('game')
export class PongController {
	constructor(
		private readonly pongService: PongService
	) {}
		
	// Get all challenges waiting for an anwser
	@Get('challenge/toanswer/') 
	async getChallengesToAnswer(@Req() req) : Promise<Challenge[]> {
		return this.pongService.getChallengesToAnswer(req.user);
	}

	// get all ongoing matches
	@Get('ongoing') 
	async getMatchesOngoing() : Promise<Pong[]> {
		return this.pongService.getMatchesOngoing();
	}

	// get one specific onGoing match
	@Get('ongoing/:id') 
	async getOneMatchOngoing(@Param('id', ParsePseudoPipe) user: User) : Promise<Pong> {
		const ret = await this.pongService.getOneMatchOngoing(user);
		if (!ret)
			throw new HttpException("No match ongoing for this user", HttpStatus.NO_CONTENT)
		else
			return ret;
	}

	// get all Matches over for a user
	@Get('history/:id')
	async getHistory(@Param('id', ParsePseudoPipe) user: User): Promise<Pong[]> {
		return this.pongService.getHistoryUser(user);
	}
	
	// get number of Wins for a user
	@Get('wins/:id')
	async getWins(@Param('id', ParsePseudoPipe) user: User): Promise<Number> {
		return this.pongService.getWinsUser(user);
	}

	// get number of Lost for a user
	@Get('lost/:id')
	async getLost(@Param('id', ParsePseudoPipe) user: User): Promise<Number> {
		return this.pongService.getLostUser(user);
	}

}
