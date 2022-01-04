import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('login')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
}
