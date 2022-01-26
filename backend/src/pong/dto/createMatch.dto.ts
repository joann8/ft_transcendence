import { User } from 'src/user/entities/user.entity';

export class CreateMatchDto {
	winner: User;
	scoreWinner: string;
	looser: User;
	scoreLooser: string; 
}

