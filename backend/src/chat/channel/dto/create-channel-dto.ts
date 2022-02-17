import { IsDefined, IsOptional } from 'class-validator';
import { channelType } from '../entities/channel.entity';

export class CreateChannelDto {
	@IsDefined()
	name: string;
	@IsDefined()
	mode: channelType;
	@IsOptional()
	password: string;
}
