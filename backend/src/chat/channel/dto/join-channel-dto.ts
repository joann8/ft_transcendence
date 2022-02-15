import { IsDefined, IsOptional } from 'class-validator';
import { channelType } from '../entities/channel.entity';

export class JoinChannelDto {
	@IsDefined()
	mode: channelType;
	@IsOptional()
	password: string;
}
