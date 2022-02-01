import { Socket } from 'socket.io';
import { User } from 'src/user/entities/user.entity';

export class CreateChallengeDto {
	challenger: User;
	challenger_socket: Socket;
	challengee: User;
	status: string;
}

