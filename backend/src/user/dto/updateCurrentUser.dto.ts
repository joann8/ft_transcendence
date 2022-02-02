<<<<<<< HEAD
import { IsNotEmpty, IsOptional } from 'class-validator';
import { status } from '../entities/user.entity';
=======
import { isEmail, IsNotEmpty, IsOptional } from 'class-validator';
>>>>>>> origin/adrien

export class UpdateCurrentUserDto {
	@IsOptional()
	@IsNotEmpty()
	id_pseudo: string;

	@IsOptional()
	avatar: string;

	@IsOptional()
<<<<<<< HEAD
	status: status;
=======
	email: string;
>>>>>>> origin/adrien
}
