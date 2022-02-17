import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	Min,
} from 'class-validator';
import { status, user_role } from '../entities/user.entity';

export class UpdateUserDto {
	@IsPositive()
	id: number;

	@IsOptional()
	@IsNotEmpty()
	id_pseudo: string;

	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	@IsNotEmpty()
	avatar: string;

	@IsOptional()
	role: user_role;

	@IsOptional()
	@Min(0)
	elo: number;

	@IsOptional()
	status: status;

	@IsOptional()
	achievement1: boolean;

	@IsOptional()
	achievement2: boolean;
}
