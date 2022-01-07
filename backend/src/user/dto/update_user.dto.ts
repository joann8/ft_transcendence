import { IsDefined, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class UpdateUserDto {
	@IsDefined()
	@IsPositive()
	id: number;

	@IsOptional()
	@IsNotEmpty()
	id_pseudo: string;

	@IsOptional()
	avatar: string;

	@IsOptional()
	two_factor: boolean;
}
