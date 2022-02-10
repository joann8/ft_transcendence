import { User } from 'src/user/entities/user.entity';

export class CreateMatchDto {
	player1: User;
	player2: User;
	room: string;
}

