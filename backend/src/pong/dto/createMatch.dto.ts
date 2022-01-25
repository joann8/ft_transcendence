import {
	IsDate,
	IsPositive,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateMatchDto {
	//@IsPositive()
	winner: User;

	//@IsPositive()
	scoreWinner: string;

	//@IsPositive()
	looser: User;

	//@IsPositive()
	scoreLooser: string; 
}

