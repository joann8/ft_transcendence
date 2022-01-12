import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	Min,
} from 'class-validator';
import { Chat } from 'src/chat/entities/chat.entity';
import { status, user_role } from '../entities/user.entity';

export class CreateUserDto {
	@IsPositive()
	id: number;

	@IsNotEmpty()
	id_pseudo: string;

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

	@IsOptional()
	chatList: Chat[];
}
