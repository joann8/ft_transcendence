import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCurrentUserDto {
	@IsOptional()
	@IsNotEmpty()
	id_pseudo: string;

	@IsOptional()
	avatar: string;

	@IsOptional()
	two_factor: boolean;
}
