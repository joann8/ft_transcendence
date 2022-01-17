import { IsDefined } from 'class-validator';

export class AddUserDto {
	@IsDefined()
	name: string;
}
