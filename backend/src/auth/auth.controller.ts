import { Controller, Get, Redirect, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class AuthController {
	@Get('42')
	@UseGuards(AuthGuard('42'))
	async login(@Request() req) {
		return req.user;
	}

	@Get('42/redirect')
	@UseGuards(AuthGuard('42'))
	@Redirect('/user')
	async redirect(@Request() req) {
		return req.user;
	}
}
