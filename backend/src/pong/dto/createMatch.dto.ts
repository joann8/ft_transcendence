import {
	IsDate,
	IsPositive,
} from 'class-validator';

export class CreateMatchDto {
	@IsPositive()
	winner : number;

	@IsPositive()
	scoreWinner : number 

	@IsPositive()
	looser: number;

	@IsPositive()
	scoreLooser : number 

	@IsDate()
	date : number
}

