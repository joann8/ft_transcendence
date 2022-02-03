import { status } from '../entities/user.entity';
import { IsEmail, isEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCurrentUserDto {
	@IsOptional()
	@IsNotEmpty()
	id_pseudo: string;

	@IsOptional()
	avatar: string;

	@IsOptional()
	status: status;
	
	@IsEmail()
	@IsOptional()
	email: string;
}
