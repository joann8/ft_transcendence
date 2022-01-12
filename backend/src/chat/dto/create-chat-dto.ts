import { IsDefined } from 'class-validator';

export class CreateChatDto {
	@IsDefined()
	name: string;
}
