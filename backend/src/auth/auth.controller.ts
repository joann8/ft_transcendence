import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Post,
	Redirect,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AdminSecretDto } from './dto/adminSecret.dto';
import { FortyTwoAuthGuard } from './guards/ft_auth.guard';

@Controller()
export class AuthController {
	constructor(private authService: AuthService) {}

	// LOGIN
	@Get('login/42')
	@Public()
	@UseGuards(FortyTwoAuthGuard)
	@Redirect('/user')
	async login(): Promise<void> {}
	// 42 CALLBACK URL
	// TODO: Verifier que l'hote appelant est bien l'intra 42 uniquement ?
	@Get('login/42/redirect')
	@Public()
	@UseGuards(FortyTwoAuthGuard)
	@Redirect('/user')
	async redir(@Req() req, @Res({ passthrough: true }) res): Promise<void> {
		const access_token = await this.authService.login(req.user);
		res.cookie('access_token', access_token);
	}
	// LOGOUT FROM MY PROFILE
	@Post('logout')
	@Redirect('/')
	async logoutCurrentUser(
		@Req() req,
		@Res({ passthrough: true }) res,
	): Promise<void> {
		res.clearCookie('access_token');
		this.authService.logout(req.user);
		console.log(`${req.user.id_pseudo} logged out...`);
	}
	// GIVE ADMIN ROLE TO USER (dto is in charge of secret verification)
	@Post('admin')
	@Redirect('/user')
	async goAdmin(
		@Req() req,
		@Body() adminSecret: AdminSecretDto,
	): Promise<void> {
		if (adminSecret.secret !== process.env['ADMIN_SECRET']) {
			throw new ForbiddenException('Wrong secret');
		}
		this.authService.setAdmin(req.user);
	}
	// REMOVE ADMIN ROLE FROM USER
	@Delete('admin')
	@Redirect('/user')
	async removeAdmin(@Req() req): Promise<void> {
		this.authService.removeAdmin(req.user);
	}
}
