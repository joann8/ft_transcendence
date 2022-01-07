import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/ft_auth.guard';
import { Public } from './guards/jwt_auth.guard';

@Controller('login')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Get('42')
	@UseGuards(FortyTwoAuthGuard)
	async login() {}

	@Public()
	@Get('42/redirect')
	@UseGuards(FortyTwoAuthGuard)
	@Redirect('/user')
	async redir(@Req() req, @Res({ passthrough: true }) res) {
		const access_token = await this.authService.login(req.user);
		res.cookie('access_token', access_token);
	}
}
