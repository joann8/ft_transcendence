import { IsDefined } from 'class-validator';
import { Message } from 'src/chat/messages/entities/message.entity';

export class CreateChannelDto {
	@IsDefined()
	name: string;
}
