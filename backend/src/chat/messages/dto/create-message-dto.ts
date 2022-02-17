import { IsDefined } from 'class-validator';

export class CreateMessageDto {
	@IsDefined()
	content: string;
}
