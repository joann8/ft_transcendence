import { IsNotEmpty, IsOptional } from 'class-validator';
import { status } from '../entities/user.entity';

export class UpdateCurrentUserDto {
	@IsOptional()
	@IsNotEmpty()
	id_pseudo: string;

	@IsOptional()
	avatar: string;

	@IsOptional()
	status: status;
}
