import { IsEmail, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateUserDto {
	@IsPositive()
	id: number;

	@IsNotEmpty()
	id_pseudo: string;

	avatar: string;

	@IsEmail()
	email: string;
}
