import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	Post,
	Redirect,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SecretDto } from './dto/adminSecret.dto';
import { FortyTwoAuthGuard } from './guards/ft_auth.guard';
import { JwtAuthGuard } from './guards/jwt_auth.guard';

@Controller()
export class AuthController {
	constructor(private authService: AuthService) {}

	// LOGIN
	@Public()
	@Get('login/42')
	@UseGuards(FortyTwoAuthGuard)
	@Redirect('/user')
	async login(): Promise<void> {}
	// 42 CALLBACK URL
	// TODO: Verifier que l'hote appelant est bien l'intra 42 uniquement ?
	@Public()
	@Get('login/42/redirect')
	@UseGuards(FortyTwoAuthGuard)
	async redir(@Req() req, @Res({ passthrough: true }) res) {
		const { access_token, user } = await this.authService.login(req.user);
		console.log(`${user.id_pseudo} logged in with 42 intranet !`);
		res.cookie('access_token', access_token);
		// FIXME: REMOVE IN PRODUCTION
		console.log(`access_token=${access_token}`);
		return access_token;
	}
	// LOGIN WITH 2FA
	@Public()
	@Post('2fa/authenticate')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Redirect('/user')
	async authenticateTwoFa(
		@Req() req,
		@Res({ passthrough: true }) res,
		@Body() { secret }: SecretDto,
	) {
		if (!req.user.two_factor_enabled) {
			throw new ForbiddenException(
				'Please turn-on 2FA before doing this',
			);
		}
		if (!this.authService.isTwoFaCodeValid(secret, req.user)) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		const access_token = await this.authService.getTwoFaAccessToken(
			req.user.id,
			true,
		);
		res.clearCookie('access_token');
		res.cookie('access_token', access_token);
		console.log(`${req.user.id_pseudo} authenticate with 2FA !`);
		// FIXME: REMOVE IN PRODUCTION
		console.log(`access_token=${access_token}`);
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
	async goAdmin(@Req() req, @Body() adminSecret: SecretDto): Promise<void> {
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
	@Post('2fa/turn-on')
	@HttpCode(200)
	async activateTwoFa(
		@Req() req,
		@Res({ passthrough: true }) res,
		@Body() { secret }: SecretDto,
	) {
		if (!this.authService.isTwoFaCodeValid(secret, req.user)) {
			throw new UnauthorizedException(
				'Wrong authentication code. Please try to generate 2FA QR Code first',
			);
		}
		await this.authService.turnOnTwoFaAuth(req.user);
		const access_token = await this.authService.getTwoFaAccessToken(
			req.user.id,
			true,
		);
		res.clearCookie('access_token');
		res.cookie('access_token', access_token);
		console.log(`${req.user.id_pseudo} turned on 2FA !`);
		// FIXME: REMOVE IN PRODUCTION
		console.log(`access_token=${access_token}`);
	}
	// DISABLE 2FA FOR CURRENT USER
	@Post('2fa/turn-off')
	@HttpCode(200)
	async desactivateTwoFa(@Req() req, @Res({ passthrough: true }) res) {
		await this.authService.turnOffTwoFaAuth(req.user);
		res.clearCookie('access_token');
		const { access_token } = await this.authService.login(req.user);
		res.cookie('access_token', access_token);
		console.log(`${req.user.id_pseudo} turned off 2FA...`);
		// FIXME: REMOVE IN PRODUCTION
		console.log(`access_token=${access_token}`);
	}
}
