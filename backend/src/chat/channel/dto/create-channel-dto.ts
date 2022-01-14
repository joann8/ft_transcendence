import { IsDefined } from 'class-validator';
import { Message } from 'src/chat/messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateChannelDto {
	@IsDefined()
	name: string;
}
