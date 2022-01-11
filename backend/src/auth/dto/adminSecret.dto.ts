import { IsDefined } from 'class-validator';

export class SecretDto {
	@IsDefined()
	secret: string;
}
