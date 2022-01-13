import { IsDefined } from 'class-validator';
import { Channel } from 'src/chat/channel/entities/channel.entity';

export class CreateMessageDto {
	@IsDefined()
	content: string;
	@IsDefined()
	channel: Channel;
}
