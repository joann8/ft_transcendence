import { IsDefined } from 'class-validator';

export class CreateChannelDto {
	@IsDefined()
	name: string;
}
