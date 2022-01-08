import { Equals, IsDefined } from 'class-validator';

export class AdminSecretDto {
	@IsDefined()
	secret: string;
}
