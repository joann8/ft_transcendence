import { User } from 'src/user/entities/user.entity';

export class CreateChallengeDto {
	challenger: User;
	challengee: User;
}

