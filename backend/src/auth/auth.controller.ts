import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SecretDto } from './dto/secret.dto';
import { FortyTwoAuthGuard } from './guards/ft_auth.guard';
import { JwtAuthGuard } from './guards/jwt_auth.guard';
import { JwtRefreshGuard } from './guards/refreshjwt_auth.guard';

@Controller()
export class AuthController {
	constructor(private authService: AuthService) {}

	// LOGIN
	@Public()
	@Get('login/42')
	@UseGuards(FortyTwoAuthGuard)
	async login(): Promise<void> {}
	// 42 CALLBACK URL
	@Public()
	@Get('login/42/redirect')
	@UseGuards(FortyTwoAuthGuard)
	async redir(@Req() req, @Res({ passthrough: true }) res) {
		let red_url = 'process.env.FRONTEND_URL';
		const { user, created } = req.user;
		const { access_token, refresh_token } = await this.authService.ft_login(
			user,
		);
		res.cookie('access_token', access_token);
		res.cookie('refresh_token', refresh_token);
		if (created) {
			red_url += '/registration';
		} else if (user.two_factor_enabled) {
			red_url += '/login/twofa';
		}
		res.redirect(red_url);
	}
	// LOGIN WITH 2FA
	@Public()
	@UseGuards(JwtAuthGuard)
	@Put('2fa/authenticate')
	@HttpCode(200)
	async authenticateTwoFa(
		@Req() req,
		@Res({ passthrough: true }) res,
		@Body() { secret }: SecretDto,
	) {
		const { access_token, refresh_token } =
			await this.authService.two_fa_login(req.user, secret);
		res.cookie('access_token', access_token);
		res.cookie('refresh_token', refresh_token);
	}
	// LOGOUT FROM MY PROFILE
	@Get('logout')
	@HttpCode(200)
	async logoutCurrentUser(
		@Req() req,
		@Res({ passthrough: true }) res,
	): Promise<void> {
		await this.authService.logout(req.user);
		res.clearCookie('access_token');
		res.clearCookie('refresh_token');
	}
	// GENERATE 2FA QR CODE
	@Get('2fa/generate')
	async generateTwoFaQRCode(@Req() req, @Res() res: Response) {
		const { otpauthUrl } =
			await this.authService.generateTwoFactorAuthentificationSecret(
				req.user,
			);
		return this.authService.pipeQrCodeStream(res, otpauthUrl);
	}
	// ENABLE 2FA FOR CURRENT USER
	@Put('2fa/turn-on')
	@HttpCode(200)
	async enableTwoFa(
		@Req() req,
		@Res({ passthrough: true }) res,
		@Body() { secret }: SecretDto,
	) {
		const { access_token, refresh_token } =
			await this.authService.turnOnTwoFaAuth(req.user, secret);
		res.cookie('access_token', access_token);
		res.cookie('refresh_token', refresh_token);
	}
	// DISABLE 2FA FOR CURRENT USER - Access token still valid
	@Put('2fa/turn-off')
	@HttpCode(200)
	async disableTwoFa(@Req() req, @Res({ passthrough: true }) res) {
		await this.authService.turnOffTwoFaAuth(req.user);
	}
	// REFRESH TOKEN
	@Public()
	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	async refresh(@Req() req, @Res({ passthrough: true }) res) {
		const access_token = await this.authService.refresh_access_token(
			req.user,
		);
		res.cookie('access_token', access_token);
		//res.cookie('refresh_token', req.cookies.refresh_token);
	}
}
