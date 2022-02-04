import { isEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { status } from '../entities/user.entity';

export class UpdateCurrentUserDto {
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	id_pseudo: string;

	@IsOptional()
	@IsString()
	avatar: string;

	@IsOptional()
	@IsEnum(status)
	status: status;
}