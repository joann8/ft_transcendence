import { IsDefined, IsOptional } from 'class-validator';
import { Message } from 'src/chat/messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { channelType } from '../entities/channel.entity';

export class CreateChannelDto {
	@IsDefined()
	name: string;
	@IsDefined()
	mode: channelType;
	@IsOptional()
	password: string;
}
