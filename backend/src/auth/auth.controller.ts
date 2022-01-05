import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortyTwo-auth.guard';

@Controller('login')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('42')
	@UseGuards(FortyTwoAuthGuard)
	async login(@Req() req) {
		console.log('login', req.user);
	}

	@Get('42/redirect')
	@UseGuards(FortyTwoAuthGuard)
	async redir(@Req() req) {
		console.log('redirect', req.user);
	}
}
